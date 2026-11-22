import { buildProviderPayload } from "./inquiry-server.mjs";

export const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";

const FIELD_LABELS = Object.freeze({
  submission_id: "Submission ID",
  submitted_at_utc: "Submitted at (UTC)",
  name: "Name",
  company: "Company",
  email: "Email",
  whatsapp: "WhatsApp / Phone",
  origin: "Origin",
  destination_country: "Destination country",
  destination: "Destination city / postal code / warehouse",
  product_name: "Product / goods",
  cargo_type: "Cargo details",
  weight: "Weight",
  volume: "Volume",
  requested_service: "Requested service",
  shipping_method: "Shipping method",
  service_needs: "Service needs",
  service: "Service",
  inspection_types: "Inspection types",
  inspection_scope: "Inspection scope",
  message: "Additional notes",
  source_page: "Source page",
  source_type: "Source type",
  product_id: "Product ID",
  package_count: "Package count",
  dimensions: "Packed dimensions",
  cargo_ready_date: "Cargo ready date",
  preferred_contact: "Preferred reply method",
  privacy_consent: "Privacy consent",
  referrer: "Referrer",
  utm_source: "UTM source",
  utm_medium: "UTM medium",
  utm_campaign: "UTM campaign"
});

function cleanHeaderValue(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
}

function isValidProviderMessageId(value) {
  return (
    typeof value === "string" &&
    /^[A-Za-z0-9][A-Za-z0-9_-]{2,127}$/.test(value.trim())
  );
}

export function buildResendEmail({
  payload,
  submissionId,
  fromEmail,
  toEmail,
  submittedAt
}) {
  const providerPayload = buildProviderPayload(payload, submissionId, submittedAt);
  const lines = [
    "GOOD LOGISTICS website inquiry",
    "",
    ...Object.entries(providerPayload)
      .filter(([field]) => !field.startsWith("_"))
      .map(([field, value]) => `${FIELD_LABELS[field] || field}: ${String(value)}`)
  ];

  return {
    from: cleanHeaderValue(fromEmail),
    to: [cleanHeaderValue(toEmail)],
    reply_to: cleanHeaderValue(payload.email),
    subject: cleanHeaderValue(providerPayload._subject),
    text: lines.join("\n")
  };
}

export async function submitViaResend({
  apiKey,
  fromEmail,
  toEmail,
  payload,
  submissionId,
  timeoutMs,
  fetchImpl = fetch
}) {
  let providerResponse;
  try {
    providerResponse = await fetchImpl(RESEND_EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `inquiry-notification/${submissionId}`
      },
      body: JSON.stringify(
        buildResendEmail({ payload, submissionId, fromEmail, toEmail })
      ),
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs)
    });
  } catch (error) {
    const timedOut = error?.name === "AbortError" || error?.name === "TimeoutError";
    return {
      submissionStatus: "PENDING",
      code: timedOut ? "PROVIDER_TIMEOUT" : "PROVIDER_NETWORK_ERROR"
    };
  }

  if (providerResponse.status === 202) {
    return { submissionStatus: "PENDING", code: "PROVIDER_ACCEPTED_PENDING" };
  }
  if (providerResponse.status === 429) {
    return { submissionStatus: "FAILED", code: "PROVIDER_RATE_LIMITED" };
  }
  if (providerResponse.status >= 400 && providerResponse.status < 500) {
    return { submissionStatus: "FAILED", code: "PROVIDER_REJECTED" };
  }
  if (providerResponse.status >= 500) {
    return { submissionStatus: "PENDING", code: "PROVIDER_RESPONSE_UNKNOWN" };
  }

  const providerContentType = providerResponse.headers.get("content-type") || "";
  const isJsonResponse =
    providerContentType.includes("application/json") || providerContentType.includes("+json");
  if (!isJsonResponse) {
    return { submissionStatus: "PENDING", code: "PROVIDER_RESPONSE_UNKNOWN" };
  }

  let providerResult;
  try {
    providerResult = await providerResponse.json();
  } catch {
    return { submissionStatus: "PENDING", code: "PROVIDER_RESPONSE_UNKNOWN" };
  }

  if (providerResponse.ok && isValidProviderMessageId(providerResult?.id)) {
    return {
      submissionStatus: "SUCCESS",
      code: "PROVIDER_ACCEPTED",
      providerMessageId: providerResult.id.trim()
    };
  }

  return { submissionStatus: "PENDING", code: "PROVIDER_RESPONSE_UNKNOWN" };
}
