import { buildProviderPayload } from "./inquiry-server.mjs";

const HUBSPOT_SECURE_SUBMISSION_BASE =
  "https://api.hsforms.com/submissions/v3/integration/secure/submit";
const CONTACT_OBJECT_TYPE_ID = "0-1";
const DEFAULT_TIMEOUT_MS = 8_000;

export const DEFAULT_HUBSPOT_FIELD_MAP = Object.freeze({
  name: "firstname",
  email: "email",
  company: "company",
  whatsapp: "phone",
  details: "gdlogi_inquiry_details"
});

const DETAIL_FIELD_LABELS = Object.freeze({
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
  form_schema_version: "Form schema version",
  referrer: "Referrer",
  utm_source: "UTM source",
  utm_medium: "UTM medium",
  utm_campaign: "UTM campaign"
});

function isValidPortalId(value) {
  return typeof value === "string" && /^[0-9]{1,20}$/.test(value.trim());
}

function isValidFormGuid(value) {
  return (
    typeof value === "string" &&
    /^[A-Za-z0-9][A-Za-z0-9-]{7,127}$/.test(value.trim())
  );
}

function isValidAccessToken(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    !/[\r\n]/.test(value)
  );
}

function isValidPropertyName(value) {
  return (
    typeof value === "string" &&
    /^[A-Za-z][A-Za-z0-9_]{0,127}$/.test(value.trim())
  );
}

function resolveFieldMap(fieldMap = {}) {
  const supportedKeys = new Set(Object.keys(DEFAULT_HUBSPOT_FIELD_MAP));
  for (const key of Object.keys(fieldMap)) {
    if (!supportedKeys.has(key)) {
      throw new TypeError(`Unsupported HubSpot field mapping for ${key}.`);
    }
  }

  const resolved = { ...DEFAULT_HUBSPOT_FIELD_MAP, ...fieldMap };
  for (const key of Object.keys(DEFAULT_HUBSPOT_FIELD_MAP)) {
    if (!isValidPropertyName(resolved[key])) {
      throw new TypeError(`Invalid HubSpot field mapping for ${key}.`);
    }
    resolved[key] = resolved[key].trim();
  }

  if (new Set(Object.values(resolved)).size !== Object.keys(resolved).length) {
    throw new TypeError("HubSpot field mappings must use unique property names.");
  }

  return resolved;
}

function resolveFormGuid({ formGuid, formId }) {
  if (
    typeof formGuid === "string" &&
    typeof formId === "string" &&
    formGuid.trim() !== formId.trim()
  ) {
    throw new TypeError("HubSpot form ID and form GUID do not match.");
  }
  return formGuid || formId;
}

export function resolveHubSpotSubmissionEndpoint({ portalId, formGuid, formId }) {
  const resolvedFormGuid = resolveFormGuid({ formGuid, formId });
  if (!isValidPortalId(portalId) || !isValidFormGuid(resolvedFormGuid)) {
    throw new TypeError("Invalid HubSpot portal ID or form GUID.");
  }

  return `${HUBSPOT_SECURE_SUBMISSION_BASE}/${encodeURIComponent(
    portalId.trim()
  )}/${encodeURIComponent(resolvedFormGuid.trim())}`;
}

export function buildHubSpotInquiryDetails({
  payload,
  submissionId,
  submittedAt = new Date()
}) {
  const providerPayload = buildProviderPayload(payload, submissionId, submittedAt);
  const completePayload = {
    ...providerPayload,
    form_schema_version: payload.form_schema_version
  };

  return [
    "GOOD LOGISTICS website inquiry",
    "",
    ...Object.entries(completePayload)
      .filter(([field, value]) => !field.startsWith("_") && value !== "")
      .map(
        ([field, value]) =>
          `${DETAIL_FIELD_LABELS[field] || field}: ${String(value)}`
      )
  ].join("\n");
}

export function buildHubSpotSubmissionBody({
  payload,
  submissionId,
  fieldMap,
  consentText,
  submittedAt = new Date()
}) {
  const resolvedFieldMap = resolveFieldMap(fieldMap);
  const details = buildHubSpotInquiryDetails({ payload, submissionId, submittedAt });
  const mappedValues = [
    ["name", payload.name],
    ["email", payload.email],
    ["company", payload.company],
    ["whatsapp", payload.whatsapp],
    ["details", details]
  ];
  const fields = mappedValues
    .filter(([, value]) => typeof value === "string" && value !== "")
    .map(([key, value]) => ({
      objectTypeId: CONTACT_OBJECT_TYPE_ID,
      name: resolvedFieldMap[key],
      value
    }));

  const body = {
    submittedAt: String(submittedAt.getTime()),
    fields,
    context: {
      pageUri: payload.source_page,
      pageName: `Good Logistics inquiry (${payload.source_type})`
    }
  };

  if (
    payload.privacy_consent === "agreed" &&
    typeof consentText === "string" &&
    consentText.trim() !== ""
  ) {
    body.legalConsentOptions = {
      consent: {
        consentToProcess: true,
        text: consentText.trim()
      }
    };
  }

  return body;
}

function safeProviderIdentifier(value) {
  if (
    typeof value === "string" &&
    /^[A-Za-z0-9][A-Za-z0-9._:-]{1,127}$/.test(value.trim())
  ) {
    return value.trim();
  }
  return undefined;
}

function providerRequestId(response, result) {
  return safeProviderIdentifier(
    response.headers.get("x-hubspot-correlation-id") || result?.correlationId
  );
}

function providerLeadId(result) {
  for (const key of ["contactId", "submissionId", "objectId", "id"]) {
    const identifier = safeProviderIdentifier(result?.[key]);
    if (identifier) return identifier;
  }
  return undefined;
}

function responseExplicitlyAccepted(result) {
  if (!result || typeof result !== "object" || Array.isArray(result)) return false;
  return [result.redirectUri, result.inlineMessage].some(
    (value) => typeof value === "string" && value.trim() !== ""
  );
}

function responseRejectsFormField(result) {
  if (!result || typeof result !== "object" || Array.isArray(result)) return false;
  const errorValues = Array.isArray(result.errors) ? result.errors : [];
  return errorValues.some((error) => {
    const errorText = `${error?.errorType || ""} ${error?.code || ""}`;
    return /FIELD_NOT_IN_FORM_DEFINITION|PROPERTY_DOESNT_EXIST/i.test(errorText);
  });
}

async function readJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json") && !contentType.includes("+json")) {
    return undefined;
  }

  try {
    const result = await response.json();
    return result && typeof result === "object" && !Array.isArray(result)
      ? result
      : undefined;
  } catch {
    return undefined;
  }
}

function result(submissionStatus, code, extras = {}) {
  return { provider: "hubspot", submissionStatus, code, ...extras };
}

export async function storeInquiryInHubSpot({
  portalId,
  formGuid,
  formId,
  accessToken,
  payload,
  submissionId,
  fieldMap,
  consentText,
  submittedAt = new Date(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
  fetchImpl = fetch
}) {
  let endpoint;
  let body;
  try {
    if (!isValidAccessToken(accessToken)) {
      throw new TypeError("Missing HubSpot server access token.");
    }
    endpoint = resolveHubSpotSubmissionEndpoint({ portalId, formGuid, formId });
    body = buildHubSpotSubmissionBody({
      payload,
      submissionId,
      fieldMap,
      consentText,
      submittedAt
    });
  } catch {
    return result("FAILED", "HUBSPOT_CONFIGURATION_ERROR");
  }

  let providerResponse;
  try {
    providerResponse = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(
        Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS
      )
    });
  } catch (error) {
    const timedOut = error?.name === "AbortError" || error?.name === "TimeoutError";
    return result(
      "PENDING",
      timedOut ? "HUBSPOT_TIMEOUT" : "HUBSPOT_NETWORK_ERROR"
    );
  }

  if (providerResponse.status === 202) {
    return result("PENDING", "HUBSPOT_ACCEPTED_PENDING");
  }

  const providerResult = await readJsonResponse(providerResponse);
  const requestId = providerRequestId(providerResponse, providerResult);
  const responseMetadata = requestId ? { providerRequestId: requestId } : {};

  if (providerResponse.status >= 400 && providerResponse.status < 500) {
    if (responseRejectsFormField(providerResult)) {
      return result("FAILED", "HUBSPOT_FORM_FIELD_REJECTED", responseMetadata);
    }
    return result(
      "FAILED",
      providerResponse.status === 429
        ? "HUBSPOT_RATE_LIMITED"
        : "HUBSPOT_REJECTED",
      responseMetadata
    );
  }

  if (providerResponse.status >= 500) {
    return result("PENDING", "HUBSPOT_RESPONSE_UNKNOWN", responseMetadata);
  }

  if (providerResponse.ok && responseExplicitlyAccepted(providerResult)) {
    const leadId = providerLeadId(providerResult);
    return result("SUCCESS", "HUBSPOT_ACCEPTED", {
      ...responseMetadata,
      ...(leadId ? { providerLeadId: leadId } : {})
    });
  }

  return result("PENDING", "HUBSPOT_RESPONSE_UNKNOWN", responseMetadata);
}
