import { createHash, randomUUID } from "node:crypto";

import {
  cleanString,
  normalizePayload,
  submitToProvider,
  validatePayload
} from "./inquiry-server.mjs";
import { inquiryConfirmationCookieName } from "./inquiry-confirmation.mjs";

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
const RATE_LIMIT_STORE_MAX = 10_000;
const IDEMPOTENCY_TTL_MS = 15 * 60 * 1000;
const IDEMPOTENCY_STORE_MAX = 1_000;
const DEFAULT_PROVIDER_TIMEOUT_MS = 28_000;
const IDEMPOTENCY_KEY_PATTERN = /^inq-[a-f0-9]{32,64}$/;
const IDEMPOTENCY_PAYLOAD_FIELDS = Object.freeze([
  "name",
  "company",
  "email",
  "whatsapp",
  "origin",
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
  "service_needs",
  "inspection_types"
]);

const defaultRateLimitStore = globalThis.__gdlogiInquiryRateLimits || new Map();
globalThis.__gdlogiInquiryRateLimits = defaultRateLimitStore;

const defaultIdempotencyStore = globalThis.__gdlogiInquiryIdempotency || new Map();
globalThis.__gdlogiInquiryIdempotency = defaultIdempotencyStore;

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
  const timeBucket = Math.floor(nowMs / IDEMPOTENCY_TTL_MS);
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

function cleanupIdempotencyStore(store, nowMs) {
  for (const [key, entry] of store) {
    if (entry.expiresAt <= nowMs) store.delete(key);
  }
  while (store.size >= IDEMPOTENCY_STORE_MAX) {
    store.delete(store.keys().next().value);
  }
}

function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    ""
  );
}

function checkRateLimit(request, store, nowMs) {
  const clientIp = getClientIp(request);
  if (!clientIp) return { limited: false };

  for (const [key, entry] of store) {
    if (entry.expiresAt <= nowMs) store.delete(key);
  }
  while (store.size >= RATE_LIMIT_STORE_MAX) store.delete(store.keys().next().value);

  const recent = (store.get(clientIp)?.timestamps || []).filter(
    (timestamp) => nowMs - timestamp < RATE_LIMIT_WINDOW_MS
  );
  if (recent.length >= RATE_LIMIT_MAX) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((RATE_LIMIT_WINDOW_MS - (nowMs - recent[0])) / 1000)
    );
    store.set(clientIp, {
      timestamps: recent,
      expiresAt: recent[0] + RATE_LIMIT_WINDOW_MS
    });
    return { limited: true, retryAfterSeconds };
  }

  recent.push(nowMs);
  store.set(clientIp, {
    timestamps: recent,
    expiresAt: recent[0] + RATE_LIMIT_WINDOW_MS
  });
  return { limited: false };
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

async function executeSubmission({
  request,
  payload,
  submissionId,
  env,
  fetchImpl,
  rateLimitStore,
  nowMs
}) {
  const rateLimit = checkRateLimit(request, rateLimitStore, nowMs);
  if (rateLimit.limited) {
    return {
      submissionStatus: "FAILED",
      code: "RATE_LIMITED",
      httpStatus: 429,
      submissionId,
      message: FAILURE_MESSAGE,
      headers: { "Retry-After": String(rateLimit.retryAfterSeconds) }
    };
  }

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

export async function handleInquiryRequest(
  request,
  {
    env = process.env,
    fetchImpl = fetch,
    rateLimitStore = defaultRateLimitStore,
    idempotencyStore = defaultIdempotencyStore,
    now = () => new Date(),
    uuidFactory = randomUUID
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

  cleanupIdempotencyStore(idempotencyStore, nowMs);
  const fingerprint = createPayloadFingerprint(payload);
  const existing = idempotencyStore.get(idempotency.key);
  if (existing) {
    if (existing.fingerprint !== fingerprint) {
      return failureResponse(request, {
        status: 409,
        code: "IDEMPOTENCY_CONFLICT",
        message:
          "This submission key was already used for different cargo details. Refresh the form and try again."
      });
    }
    const outcome = existing.outcome || await existing.promise;
    return responseFromOutcome(request, outcome, true);
  }

  const promise = executeSubmission({
    request,
    payload,
    submissionId,
    env,
    fetchImpl,
    rateLimitStore,
    nowMs
  });
  idempotencyStore.set(idempotency.key, {
    fingerprint,
    expiresAt: nowMs + IDEMPOTENCY_TTL_MS,
    promise
  });

  let outcome;
  try {
    outcome = await promise;
  } catch {
    outcome = {
      submissionStatus: "PENDING",
      code: "PROVIDER_RESPONSE_UNKNOWN",
      submissionId
    };
  }
  idempotencyStore.set(idempotency.key, {
    fingerprint,
    expiresAt: nowMs + IDEMPOTENCY_TTL_MS,
    outcome
  });
  return responseFromOutcome(request, outcome);
}
