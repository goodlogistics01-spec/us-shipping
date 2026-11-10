import { NextResponse } from "next/server";
import {
  cleanString,
  normalizePayload,
  submitToProvider,
  validatePayload
} from "../../lib/inquiry-server.mjs";

export const runtime = "nodejs";
export const maxDuration = 30;

const RECIPIENT_EMAIL = "zoe@gdlogi.com";
const FORMSUBMIT_ENDPOINT =
  process.env.INQUIRY_PROVIDER_ENDPOINT || `https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`;
const SUCCESS_PATH = "/thank-you/";
const FAILURE_MESSAGE =
  "We couldn’t send your inquiry. Please try again or contact us by WhatsApp or email.";
const PENDING_MESSAGE =
  "We could not confirm delivery yet. This request has not been counted as accepted and will not be sent again automatically.";
const MAX_BODY_BYTES = 32_768;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const DEFAULT_PROVIDER_TIMEOUT_MS = 28_000;
const configuredProviderTimeout = Number(process.env.INQUIRY_PROVIDER_TIMEOUT_MS);
const PROVIDER_TIMEOUT_MS =
  Number.isFinite(configuredProviderTimeout) && configuredProviderTimeout > 0
    ? Math.min(configuredProviderTimeout, DEFAULT_PROVIDER_TIMEOUT_MS)
    : DEFAULT_PROVIDER_TIMEOUT_MS;

const rateLimitStore = globalThis.__gdlogiInquiryRateLimits || new Map();
globalThis.__gdlogiInquiryRateLimits = rateLimitStore;

function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(request) {
  const now = Date.now();
  const clientIp = getClientIp(request);
  const recent = (rateLimitStore.get(clientIp) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(clientIp, recent);
    return true;
  }

  recent.push(now);
  rateLimitStore.set(clientIp, recent);
  return false;
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
      service_needs: params.getAll("service_needs")
    };
  }

  throw new Error("UNSUPPORTED_CONTENT_TYPE");
}

function wantsJson(request) {
  return (
    (request.headers.get("accept") || "").includes("application/json") ||
    (request.headers.get("content-type") || "").includes("application/json")
  );
}

function createSubmissionId(now = new Date()) {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now).replaceAll("-", "");
  const randomPart = crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `GL-${date}-${randomPart}`;
}

function setAcceptedCookie(response, request, requestId) {
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const isSecure = forwardedProtocol === "https" || new URL(request.url).protocol === "https:";
  response.cookies.set("gdlogi_inquiry_accepted", requestId, {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecure,
    path: "/",
    maxAge: 5 * 60
  });
  return response;
}

function failureResponse(
  request,
  { status = 502, code = "DELIVERY_FAILED", errors, submissionId = "" } = {}
) {
  if (wantsJson(request)) {
    return NextResponse.json(
      {
        ok: false,
        submission_status: "FAILED",
        code,
        message: FAILURE_MESSAGE,
        ...(submissionId ? { submission_id: submissionId, request_id: submissionId } : {}),
        ...(errors ? { errors } : {})
      },
      { status, headers: { "Cache-Control": "no-store" } }
    );
  }

  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Inquiry not sent | Good Logistics</title></head><body><main><h1>We couldn’t send your inquiry</h1><p>${FAILURE_MESSAGE}</p>${submissionId ? `<p>Reference: ${submissionId}</p>` : ""}<p><a href="/quote/">Return to the quote form</a> · <a href="https://wa.me/8613556861676">WhatsApp</a> · <a href="mailto:${RECIPIENT_EMAIL}">${RECIPIENT_EMAIL}</a></p></main></body></html>`,
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8"
      }
    }
  );
}

function pendingResponse(request, { submissionId, code = "PROVIDER_RESPONSE_UNKNOWN" }) {
  if (wantsJson(request)) {
    return NextResponse.json(
      {
        submission_status: "PENDING",
        code,
        message: PENDING_MESSAGE,
        submission_id: submissionId,
        request_id: submissionId
      },
      { status: 202, headers: { "Cache-Control": "no-store" } }
    );
  }

  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Inquiry status pending | Good Logistics</title></head><body><main><h1>Delivery is not yet confirmed</h1><p>${PENDING_MESSAGE}</p><p>Reference: ${submissionId}</p><p><a href="https://wa.me/8613556861676">WhatsApp</a> · <a href="mailto:${RECIPIENT_EMAIL}">${RECIPIENT_EMAIL}</a></p></main></body></html>`,
    {
      status: 202,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8"
      }
    }
  );
}

export async function POST(request) {
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
    return NextResponse.json(
      { ok: false, submission_status: "FILTERED", filtered: true },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }

  const submissionId = createSubmissionId();
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

  if (isRateLimited(request)) {
    return failureResponse(request, {
      status: 429,
      code: "RATE_LIMITED",
      submissionId
    });
  }

  const providerOutcome = await submitToProvider({
    endpoint: FORMSUBMIT_ENDPOINT,
    payload,
    submissionId,
    timeoutMs: PROVIDER_TIMEOUT_MS
  });

  if (providerOutcome.submissionStatus === "FAILED") {
    return failureResponse(request, {
      status: providerOutcome.code === "ACTIVATION_REQUIRED" ? 503 : 502,
      code: providerOutcome.code,
      submissionId
    });
  }
  if (providerOutcome.submissionStatus !== "SUCCESS") {
    return pendingResponse(request, {
      submissionId,
      code: providerOutcome.code
    });
  }

  if (wantsJson(request)) {
    const response = NextResponse.json(
      {
        ok: true,
        submission_status: "SUCCESS",
        submission_id: submissionId,
        request_id: submissionId,
        redirect: SUCCESS_PATH
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
    return setAcceptedCookie(response, request, submissionId);
  }

  const response = NextResponse.redirect(new URL(SUCCESS_PATH, request.url), 303);
  return setAcceptedCookie(response, request, submissionId);
}
