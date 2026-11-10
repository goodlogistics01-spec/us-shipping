export const INQUIRY_FAILURE_MESSAGE =
  "We couldn’t send your inquiry. Please try again or contact us by WhatsApp or email.";

export const INQUIRY_PENDING_MESSAGE =
  "We could not confirm delivery yet. This request has not been counted as accepted and will not be sent again automatically.";

const CLIENT_RESPONSE_TIMEOUT_MS = 32_000;
const IDEMPOTENCY_WINDOW_MS = 15 * 60 * 1000;
const IDEMPOTENCY_FIELDS = [
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
];

export function formDataToInquiryPayload(formData) {
  const payload = {};

  for (const [name, value] of formData.entries()) {
    if (name === "service_needs" || name === "inspection_types") {
      payload[name] = [...(payload[name] || []), value];
      continue;
    }
    payload[name] = value;
  }

  return payload;
}

function canonicalIdempotencyPayload(payload) {
  return JSON.stringify(
    Object.fromEntries(
      IDEMPOTENCY_FIELDS.map((name) => {
        const value = payload[name];
        return [name, Array.isArray(value) ? [...value].sort() : String(value || "")];
      })
    )
  );
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function createIdempotencyKey(payload) {
  const timeBucket = Math.floor(Date.now() / IDEMPOTENCY_WINDOW_MS);
  const input = new TextEncoder().encode(
    `${timeBucket}\n${canonicalIdempotencyPayload(payload)}`
  );
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest("SHA-256", input);
    return `inq-${bytesToHex(new Uint8Array(digest))}`;
  }

  const fallbackBytes = new Uint8Array(32);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(fallbackBytes);
  } else {
    for (let index = 0; index < fallbackBytes.length; index += 1) {
      fallbackBytes[index] = Math.floor(Math.random() * 256);
    }
  }
  return `inq-${bytesToHex(fallbackBytes)}`;
}

export function getPublicSourcePage(location) {
  const path = location.pathname || "/";
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    return `https://gdlogi.us${path}`;
  }
  return `${location.origin}${path}`;
}

export async function submitInquiryForm(form) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), CLIENT_RESPONSE_TIMEOUT_MS);

  try {
    const payload = formDataToInquiryPayload(new FormData(form));
    const idempotencyKey = await createIdempotencyKey(payload);
    payload.idempotency_key = idempotencyKey;
    let response;
    try {
      response = await fetch("/api/inquiry/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
    } catch {
      return {
        submission_status: "PENDING",
        code: "CLIENT_RESPONSE_UNKNOWN",
        message: INQUIRY_PENDING_MESSAGE
      };
    }

    const result = await response.json().catch(() => null);
    const submissionStatus = result?.submission_status;

    if (!result) {
      return {
        submission_status: "PENDING",
        code: "CLIENT_RESPONSE_UNKNOWN",
        message: INQUIRY_PENDING_MESSAGE
      };
    }

    if (response.status === 202 || submissionStatus === "PENDING") {
      return {
        ...result,
        submission_status: "PENDING",
        message: result?.message || INQUIRY_PENDING_MESSAGE
      };
    }

    if (submissionStatus === "FAILED") {
      const error = new Error(result?.message || INQUIRY_FAILURE_MESSAGE);
      error.code = result?.code || "DELIVERY_FAILED";
      error.submissionId = result?.submission_id || "";
      error.fieldErrors = result?.errors || {};
      throw error;
    }

    if (response.ok && result?.ok === true && submissionStatus === "SUCCESS") {
      return result;
    }

    return {
      ...result,
      submission_status: "PENDING",
      code: result?.code || "CLIENT_RESPONSE_UNKNOWN",
      message: result?.message || INQUIRY_PENDING_MESSAGE
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
