import { createHash, createHmac, randomUUID } from "node:crypto";

import {
  cleanString,
  normalizePayload,
  submitToProvider,
  validatePayload
} from "./inquiry-server.mjs";
import { inquiryConfirmationCookieName } from "./inquiry-confirmation.mjs";
import {
  createMemoryInquiryStateStore,
  createUpstashInquiryStateStore,
  INQUIRY_STATE_STORE_TIMEOUT_MS
} from "./inquiry-state-store.mjs";

export const RECIPIENT_EMAIL = "zoe@gdlogi.com";
export const SUCCESS_PATH = "/thank-you/";
export const FAILURE_MESSAGE =
  "We couldn’t send your inquiry. Please try again or contact us by WhatsApp or email.";
export const PENDING_MESSAGE =
  "We could not confirm delivery yet. This request has not been counted as accepted and will not be sent again automatically.";

const CONFIGURATION_MESSAGE =
  "Inquiry delivery is not configured correctly. Please contact us by WhatsApp or email.";
const MAX_BODY_BYTES = 32_768;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;
const IDEMPOTENCY_KEY_WINDOW_MS = 15 * 60 * 1000;
const ROUTE_EXECUTION_BUDGET_MS = 30_000;
const SHARED_STATE_CALLS_PER_SUBMISSION = 3;
const RESPONSE_HEADROOM_MS = 3_000;
const DEFAULT_PROVIDER_TIMEOUT_MS =
  ROUTE_EXECUTION_BUDGET_MS -
  INQUIRY_STATE_STORE_TIMEOUT_MS * SHARED_STATE_CALLS_PER_SUBMISSION -
  RESPONSE_HEADROOM_MS;
const IDEMPOTENCY_KEY_PATTERN = /^inq-[a-f0-9]{32,64}$/;
const IDEMPOTENCY_PAYLOAD_FIELDS = Object.freeze([
  "name",
  "company",
  "email",
  "whatsapp",
  "origin",
  "destination_country",
  "destination",
  "cargo_type",
  "weight",
  "volume",
  "service",
  "shipping_method",
  "message",
  "product_id",
  "product_name",
  "package_count",
  "dimensions",
  "cargo_ready_date",
  "preferred_contact",
  "privacy_consent",
  "form_schema_version",
  "service_needs",
  "inspection_types"
]);

const localMemoryRateLimits = globalThis.__gdlogiInquiryRateLimits || new Map();
globalThis.__gdlogiInquiryRateLimits = localMemoryRateLimits;

const localMemoryIdempotency = globalThis.__gdlogiInquiryIdempotency || new Map();
globalThis.__gdlogiInquiryIdempotency = localMemoryIdempotency;

function jsonResponse(body, status, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      ...headers
    }
  });
}

function wantsJson(request) {
  return (
    (request.headers.get("accept") || "").includes("application/json") ||
    (request.headers.get("content-type") || "").includes("application/json")
  );
}

function createSubmissionId(now, uuidFactory) {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now).replaceAll("-", "");
  const randomPart = uuidFactory().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `GL-${date}-${randomPart}`;
}

function acceptedCookie(request, requestId) {
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const isSecure = forwardedProtocol === "https" || new URL(request.url).protocol === "https:";
  return [
    `${inquiryConfirmationCookieName(requestId)}=${encodeURIComponent(requestId)}`,
    "Path=/",
    "Max-Age=300",
    "HttpOnly",
    "SameSite=Lax",
    ...(isSecure ? ["Secure"] : [])
  ].join("; ");
}

function failureResponse(
  request,
  {
    status = 502,
    code = "DELIVERY_FAILED",
    errors,
    submissionId = "",
    message = FAILURE_MESSAGE,
    headers = {},
    replayed = false
  } = {}
) {
  const responseHeaders = {
    ...headers,
    ...(replayed ? { "Idempotency-Replayed": "true" } : {})
  };
  if (wantsJson(request)) {
    return jsonResponse(
      {
        ok: false,
        submission_status: "FAILED",
        code,
        message,
        ...(submissionId ? { submission_id: submissionId, request_id: submissionId } : {}),
        ...(errors ? { errors } : {}),
        ...(replayed ? { idempotency_replayed: true } : {})
      },
      status,
      responseHeaders
    );
  }

  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Inquiry not sent | Good Logistics</title></head><body><main><h1>We couldn’t send your inquiry</h1><p>${message}</p>${submissionId ? `<p>Reference: ${submissionId}</p>` : ""}<p><a href="/quote/">Return to the quote form</a> · <a href="https://wa.me/8613556861676">WhatsApp</a> · <a href="mailto:${RECIPIENT_EMAIL}">${RECIPIENT_EMAIL}</a></p></main></body></html>`,
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
        ...responseHeaders
      }
    }
  );
}

function pendingResponse(request, { submissionId, code, replayed = false }) {
  const replayHeaders = replayed ? { "Idempotency-Replayed": "true" } : {};
  if (wantsJson(request)) {
    return jsonResponse(
      {
        submission_status: "PENDING",
        code,
        message: PENDING_MESSAGE,
        submission_id: submissionId,
        request_id: submissionId,
        ...(replayed ? { idempotency_replayed: true } : {})
      },
      202,
      replayHeaders
    );
  }

  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Inquiry status pending | Good Logistics</title></head><body><main><h1>Delivery is not yet confirmed</h1><p>${PENDING_MESSAGE}</p><p>Reference: ${submissionId}</p><p><a href="https://wa.me/8613556861676">WhatsApp</a> · <a href="mailto:${RECIPIENT_EMAIL}">${RECIPIENT_EMAIL}</a></p></main></body></html>`,
    {
      status: 202,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
        ...replayHeaders
      }
    }
  );
}

function successResponse(request, { submissionId, replayed = false }) {
  const redirect = `${SUCCESS_PATH}?request_id=${encodeURIComponent(submissionId)}`;
  const headers = {
    "Set-Cookie": acceptedCookie(request, submissionId),
    ...(replayed ? { "Idempotency-Replayed": "true" } : {})
  };
  if (wantsJson(request)) {
    return jsonResponse(
      {
        ok: true,
        submission_status: "SUCCESS",
        submission_id: submissionId,
        request_id: submissionId,
        redirect,
        ...(replayed ? { idempotency_replayed: true } : {})
      },
      200,
      headers
    );
  }

  return new Response(null, {
    status: 303,
    headers: {
      ...headers,
      Location: new URL(redirect, request.url).toString(),
      "Cache-Control": "no-store"
    }
  });
}

function responseFromOutcome(request, outcome, replayed = false) {
  if (outcome.submissionStatus === "SUCCESS") {
    return successResponse(request, { submissionId: outcome.submissionId, replayed });
  }
  if (outcome.submissionStatus === "PENDING") {
    return pendingResponse(request, {
      submissionId: outcome.submissionId,
      code: outcome.code,
      replayed
    });
  }
  return failureResponse(request, {
    status: outcome.httpStatus,
    code: outcome.code,
    submissionId: outcome.submissionId,
    message: outcome.message,
    headers: outcome.headers,
    replayed
  });
}

async function readPayload(request) {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) throw new Error("PAYLOAD_TOO_LARGE");

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return JSON.parse(rawBody || "{}");
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(rawBody);
    return {
      ...Object.fromEntries(params),
      service_needs: params.getAll("service_needs"),
      inspection_types: params.getAll("inspection_types")
    };
  }

  throw new Error("UNSUPPORTED_CONTENT_TYPE");
}

function canonicalPayload(payload) {
  return JSON.stringify(
    Object.fromEntries(
      IDEMPOTENCY_PAYLOAD_FIELDS
        .map((key) => [
          key,
          Array.isArray(payload[key]) ? [...payload[key]].sort() : payload[key] || ""
        ])
    )
  );
}

export function createPayloadFingerprint(payload) {
  return createHash("sha256").update(canonicalPayload(payload)).digest("hex");
}

function deriveIdempotencyKey(payload, nowMs) {
  const timeBucket = Math.floor(nowMs / IDEMPOTENCY_KEY_WINDOW_MS);
  const digest = createHash("sha256")
    .update(`${timeBucket}\n${canonicalPayload(payload)}`)
    .digest("hex");
  return `inq-${digest}`;
}

function getIdempotencyKey(request, raw, payload, nowMs) {
  const headerKey = String(request.headers.get("idempotency-key") || "").trim().toLowerCase();
  const bodyKey = String(raw.idempotency_key || "").trim().toLowerCase();
  if (headerKey && bodyKey && headerKey !== bodyKey) return { error: "IDEMPOTENCY_KEY_MISMATCH" };
  const suppliedKey = headerKey || bodyKey;
  if (suppliedKey && !IDEMPOTENCY_KEY_PATTERN.test(suppliedKey)) {
    return { error: "INVALID_IDEMPOTENCY_KEY" };
  }
  return { key: suppliedKey || deriveIdempotencyKey(payload, nowMs) };
}

function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    ""
  );
}

function requestHostname(request) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host") || new URL(request.url).host;
  try {
    return new URL(`http://${host}`).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function isLoopbackHostname(hostname) {
  const normalized = hostname.startsWith("[") && hostname.endsWith("]")
    ? hostname.slice(1, -1)
    : hostname;
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "::1"
  );
}

function isPrivateHostname(hostname) {
  const normalized = hostname.startsWith("[") && hostname.endsWith("]")
    ? hostname.slice(1, -1)
    : hostname;
  if (isLoopbackHostname(normalized) || normalized.endsWith(".localhost")) return true;
  if (normalized === "0.0.0.0" || normalized === "169.254.169.254") return true;
  const parts = normalized.split(".").map(Number);
  if (parts.length === 4 && parts.every((part) => Number.isInteger(part))) {
    return (
      parts[0] === 10 ||
      parts[0] === 127 ||
      (parts[0] === 169 && parts[1] === 254) ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168)
    );
  }
  return (
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:")
  );
}

export function resolveProviderConfiguration(request, env = process.env) {
  const endpointValue =
    env.INQUIRY_PROVIDER_ENDPOINT || `https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`;
  let endpoint;
  try {
    endpoint = new URL(endpointValue);
  } catch {
    return { ok: false, code: "PROVIDER_CONFIGURATION_ERROR" };
  }

  const providerHost = endpoint.hostname.toLowerCase();
  const incomingHost = requestHostname(request);
  const localRequest = isLoopbackHostname(incomingHost);
  const localProvider = isLoopbackHostname(providerHost);
  const providerMode = String(env.INQUIRY_PROVIDER_MODE || "").trim().toLowerCase();

  if (providerMode && providerMode !== "local-mock") {
    return { ok: false, code: "PROVIDER_CONFIGURATION_ERROR" };
  }

  if (providerHost.endsWith(".invalid")) {
    return { ok: false, code: "PROVIDER_CONFIGURATION_ERROR" };
  }
  if (localProvider) {
    const localMockAllowed =
      providerMode === "local-mock" &&
      env.INQUIRY_ALLOW_LOCAL_MOCK === "true" &&
      localRequest &&
      endpoint.protocol === "http:";
    if (!localMockAllowed) return { ok: false, code: "PROVIDER_CONFIGURATION_ERROR" };
  } else if (providerMode === "local-mock") {
    return { ok: false, code: "PROVIDER_CONFIGURATION_ERROR" };
  } else if (endpoint.protocol !== "https:" || isPrivateHostname(providerHost)) {
    return { ok: false, code: "PROVIDER_CONFIGURATION_ERROR" };
  }
  if (
    localRequest &&
    !localProvider &&
    env.INQUIRY_ALLOW_REAL_PROVIDER_LOCAL !== "true"
  ) {
    return { ok: false, code: "PROVIDER_CONFIGURATION_ERROR" };
  }

  const configuredTimeout = Number(env.INQUIRY_PROVIDER_TIMEOUT_MS);
  const timeoutMs =
    Number.isFinite(configuredTimeout) && configuredTimeout > 0
      ? Math.min(configuredTimeout, DEFAULT_PROVIDER_TIMEOUT_MS)
      : DEFAULT_PROVIDER_TIMEOUT_MS;
  return { ok: true, endpoint: endpoint.toString(), timeoutMs };
}

export function resolveInquiryStateStore(
  request,
  env = process.env,
  { fetchImpl = fetch } = {}
) {
  const mode = String(env.INQUIRY_STATE_STORE || "").trim().toLowerCase();
  const localRequest = isLoopbackHostname(requestHostname(request));
  const keySecret = String(env.INQUIRY_STATE_KEY_SECRET || "");

  if (mode === "memory") {
    if (!localRequest || env.INQUIRY_ALLOW_MEMORY_STATE !== "true") {
      return { ok: false, code: "STATE_STORE_CONFIGURATION_ERROR" };
    }
    return {
      ok: true,
      store: createMemoryInquiryStateStore({
        idempotencyStore: localMemoryIdempotency,
        rateLimitStore: localMemoryRateLimits
      }),
      keySecret: keySecret || "gdlogi-local-memory-state-only"
    };
  }

  if (mode !== "upstash-redis") {
    return { ok: false, code: "STATE_STORE_CONFIGURATION_ERROR" };
  }
  if (
    !env.UPSTASH_REDIS_REST_URL ||
    !env.UPSTASH_REDIS_REST_TOKEN ||
    keySecret.length < 16
  ) {
    return { ok: false, code: "STATE_STORE_CONFIGURATION_ERROR" };
  }

  try {
    return {
      ok: true,
      store: createUpstashInquiryStateStore({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
        namespace: env.INQUIRY_STATE_NAMESPACE || "gdlogi:inquiry",
        fetchImpl
      }),
      keySecret
    };
  } catch {
    return { ok: false, code: "STATE_STORE_CONFIGURATION_ERROR" };
  }
}

function createRateLimitKey(request, keySecret) {
  const clientIp = getClientIp(request);
  if (!clientIp) return "";
  return createHmac("sha256", keySecret).update(clientIp).digest("hex");
}

async function executeSubmission({
  request,
  payload,
  submissionId,
  env,
  fetchImpl
}) {
  const providerConfiguration = resolveProviderConfiguration(request, env);
  if (!providerConfiguration.ok) {
    return {
      submissionStatus: "FAILED",
      code: providerConfiguration.code,
      httpStatus: 503,
      submissionId,
      message: CONFIGURATION_MESSAGE
    };
  }

  const providerOutcome = await submitToProvider({
    endpoint: providerConfiguration.endpoint,
    payload,
    submissionId,
    timeoutMs: providerConfiguration.timeoutMs,
    fetchImpl
  });
  if (providerOutcome.submissionStatus === "FAILED") {
    return {
      ...providerOutcome,
      httpStatus: providerOutcome.code === "ACTIVATION_REQUIRED" ? 503 : 502,
      submissionId,
      message: FAILURE_MESSAGE
    };
  }
  return { ...providerOutcome, submissionId };
}

function stateStoreFailureOutcome(submissionId, code = "STATE_STORE_UNAVAILABLE") {
  return {
    submissionStatus: "FAILED",
    code,
    httpStatus: 503,
    submissionId,
    message: CONFIGURATION_MESSAGE
  };
}

async function completeOutcome({
  stateStore,
  idempotencyKey,
  fingerprint,
  ownerToken,
  outcome,
  nowMs
}) {
  try {
    const completion = await stateStore.complete({
      key: idempotencyKey,
      fingerprint,
      ownerToken,
      outcome,
      nowMs,
      ttlMs: IDEMPOTENCY_TTL_MS
    });
    return completion?.status === "STORED";
  } catch {
    return false;
  }
}

export async function handleInquiryRequest(
  request,
  {
    env = process.env,
    fetchImpl = fetch,
    stateStore,
    stateStoreFetchImpl = fetch,
    stateKeySecret,
    rateLimitStore,
    idempotencyStore,
    now = () => new Date(),
    uuidFactory = randomUUID,
    ownerTokenFactory = randomUUID
  } = {}
) {
  let raw;
  try {
    raw = await readPayload(request);
  } catch (error) {
    const payloadTooLarge = error.message === "PAYLOAD_TOO_LARGE";
    return failureResponse(request, {
      status: payloadTooLarge ? 413 : 400,
      code: payloadTooLarge ? "PAYLOAD_TOO_LARGE" : "INVALID_REQUEST"
    });
  }

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return failureResponse(request, { status: 400, code: "INVALID_REQUEST" });
  }
  if (cleanString(raw._honey || raw.website, 200)) {
    return jsonResponse(
      { ok: false, submission_status: "FILTERED", filtered: true },
      200
    );
  }

  const currentDate = now();
  const nowMs = currentDate.getTime();
  const submissionId = createSubmissionId(currentDate, uuidFactory);
  const payload = normalizePayload(raw, request);
  const errors = validatePayload(payload);
  if (Object.keys(errors).length > 0) {
    return failureResponse(request, {
      status: 400,
      code: "VALIDATION_FAILED",
      errors,
      submissionId
    });
  }

  const idempotency = getIdempotencyKey(request, raw, payload, nowMs);
  if (idempotency.error) {
    return failureResponse(request, {
      status: 400,
      code: idempotency.error,
      submissionId
    });
  }

  const fingerprint = createPayloadFingerprint(payload);
  let activeStore = stateStore;
  let activeKeySecret = stateKeySecret;
  if (!activeStore && (rateLimitStore || idempotencyStore)) {
    activeStore = createMemoryInquiryStateStore({
      rateLimitStore: rateLimitStore || new Map(),
      idempotencyStore: idempotencyStore || new Map()
    });
    activeKeySecret = activeKeySecret || "gdlogi-injected-test-state";
  }
  if (!activeStore) {
    const stateConfiguration = resolveInquiryStateStore(request, env, {
      fetchImpl: stateStoreFetchImpl
    });
    if (!stateConfiguration.ok) {
      return failureResponse(request, {
        status: 503,
        code: stateConfiguration.code,
        submissionId,
        message: CONFIGURATION_MESSAGE
      });
    }
    activeStore = stateConfiguration.store;
    activeKeySecret = stateConfiguration.keySecret;
  }
  if (typeof activeKeySecret !== "string" || activeKeySecret.length < 16) {
    return failureResponse(request, {
      status: 503,
      code: "STATE_STORE_CONFIGURATION_ERROR",
      submissionId,
      message: CONFIGURATION_MESSAGE
    });
  }

  const ownerToken = ownerTokenFactory();
  let claim;
  try {
    claim = await activeStore.claim({
      key: idempotency.key,
      fingerprint,
      submissionId,
      ownerToken,
      nowMs,
      ttlMs: IDEMPOTENCY_TTL_MS
    });
  } catch {
    return failureResponse(request, {
      status: 503,
      code: "STATE_STORE_UNAVAILABLE",
      submissionId,
      message: CONFIGURATION_MESSAGE
    });
  }

  if (claim?.status === "CONFLICT") {
    return failureResponse(request, {
      status: 409,
      code: "IDEMPOTENCY_CONFLICT",
      submissionId: claim.submissionId || "",
      message:
        "This submission key was already used for different cargo details. Refresh the form and try again."
    });
  }
  if (claim?.status === "PROCESSING") {
    return pendingResponse(request, {
      submissionId: claim.submissionId,
      code: "SUBMISSION_IN_PROGRESS",
      replayed: true
    });
  }
  if (claim?.status === "REPLAY" && claim.outcome) {
    return responseFromOutcome(request, claim.outcome, true);
  }
  if (claim?.status !== "CLAIMED") {
    return failureResponse(request, {
      status: 503,
      code: "STATE_STORE_RESPONSE_INVALID",
      submissionId,
      message: CONFIGURATION_MESSAGE
    });
  }

  const rateLimitKey = createRateLimitKey(request, activeKeySecret);
  if (rateLimitKey) {
    let rateLimit;
    try {
      rateLimit = await activeStore.checkRateLimit({
        key: rateLimitKey,
        member: `${nowMs}:${ownerToken}`,
        nowMs,
        windowMs: RATE_LIMIT_WINDOW_MS,
        max: RATE_LIMIT_MAX
      });
    } catch {
      const outcome = stateStoreFailureOutcome(submissionId);
      await completeOutcome({
        stateStore: activeStore,
        idempotencyKey: idempotency.key,
        fingerprint,
        ownerToken,
        outcome,
        nowMs
      });
      return responseFromOutcome(request, outcome);
    }

    if (rateLimit.limited) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil(Number(rateLimit.retryAfterMs || 0) / 1000)
      );
      const outcome = {
        submissionStatus: "FAILED",
        code: "RATE_LIMITED",
        httpStatus: 429,
        submissionId,
        message: FAILURE_MESSAGE,
        headers: { "Retry-After": String(retryAfterSeconds) }
      };
      const stored = await completeOutcome({
        stateStore: activeStore,
        idempotencyKey: idempotency.key,
        fingerprint,
        ownerToken,
        outcome,
        nowMs
      });
      if (!stored) {
        return failureResponse(request, {
          status: 503,
          code: "STATE_STORE_UNAVAILABLE",
          submissionId,
          message: CONFIGURATION_MESSAGE
        });
      }
      return responseFromOutcome(request, outcome);
    }
  }

  let outcome;
  try {
    outcome = await executeSubmission({
      request,
      payload,
      submissionId,
      env,
      fetchImpl
    });
  } catch {
    outcome = {
      submissionStatus: "PENDING",
      code: "PROVIDER_RESPONSE_UNKNOWN",
      submissionId
    };
  }

  const stored = await completeOutcome({
    stateStore: activeStore,
    idempotencyKey: idempotency.key,
    fingerprint,
    ownerToken,
    outcome,
    nowMs
  });
  if (!stored) {
    return pendingResponse(request, {
      submissionId,
      code: "STATE_STORE_WRITE_UNKNOWN"
    });
  }
  return responseFromOutcome(request, outcome);
}
