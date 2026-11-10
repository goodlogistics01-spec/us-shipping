export const FIELD_LIMITS = Object.freeze({
  name: 100,
  company: 160,
  email: 254,
  whatsapp: 50,
  origin: 160,
  destination: 160,
  cargo_type: 2000,
  weight: 100,
  volume: 160,
  service: 120,
  shipping_method: 80,
  message: 3000,
  source_page: 500,
  source_type: 80,
  product_id: 120,
  product_name: 180,
  package_count: 80,
  dimensions: 160,
  cargo_ready_date: 32,
  preferred_contact: 20,
  privacy_consent: 20,
  referrer: 500,
  utm_source: 100,
  utm_medium: 100,
  utm_campaign: 160
});

export const SERVICE_LABELS = Object.freeze({
  "ocean-freight": "Ocean Freight",
  "ocean-fcl": "Ocean FCL",
  "ocean-lcl": "Ocean LCL",
  "air-freight": "Air Freight",
  "ddp-door-to-door": "DDP Door-to-Door",
  "amazon-fba": "Amazon FBA",
  "supplier-consolidation": "Supplier Consolidation",
  "china-pickup": "China Pickup",
  "customs-clearance": "Customs Clearance",
  warehousing: "Warehousing",
  "final-delivery": "Final Delivery",
  "oversized-cargo": "Oversized Cargo",
  express: "Express",
  "not-sure": "Not sure — please recommend"
});

export const SHIPPING_METHOD_LABELS = Object.freeze({
  "not-sure": "Not sure — please advise",
  "ocean-freight": "Ocean freight — review FCL/LCL",
  "ocean-fcl": "Ocean FCL",
  "ocean-lcl": "Ocean LCL",
  "air-freight": "Air freight",
  express: "Express / courier"
});

export const SERVICE_NEED_LABELS = Object.freeze({
  shipping: "Shipping",
  "supplier-pickup": "Supplier Pickup",
  consolidation: "Consolidation",
  warehousing: "Warehousing",
  "fba-prep-labeling": "FBA Prep / Labeling",
  repacking: "Repacking",
  "kitting-light-assembly": "Kitting / Light Assembly",
  inspection: "Inspection",
  "not-sure": "Not sure — please advise"
});

export const SOURCE_LABELS = Object.freeze({
  "homepage-quick-quote": "Homepage Quick Quote",
  "quote-page": "Quote Page",
  "service-page": "Service Page",
  "article-popup": "Article Popup"
});

const PREFERRED_CONTACT_VALUES = new Set(["email", "whatsapp", "either"]);

export function cleanString(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.replace(/\0/g, "").trim().slice(0, maxLength);
}

export function normalizePhone(value) {
  return cleanString(value, FIELD_LIMITS.whatsapp)
    .normalize("NFKC")
    .replace(/\s+/g, " ");
}

export function isValidPhone(value) {
  if (!value) return false;
  if (!/^\+?[0-9][0-9\s().-]*$/.test(value)) return false;
  const digitCount = value.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 20;
}

export function isValidEmail(value) {
  if (!value || value.length > FIELD_LIMITS.email || value.includes("..")) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false;

  const separator = value.lastIndexOf("@");
  const localPart = value.slice(0, separator);
  const domain = value.slice(separator + 1);
  if (!localPart || localPart.startsWith(".") || localPart.endsWith(".")) return false;

  return domain
    .split(".")
    .every((label) => label && !label.startsWith("-") && !label.endsWith("-"));
}

function normalizeService(value) {
  const aliases = {
    "sea-freight": "ocean-freight",
    "sea-freight-china-to-usa": "ocean-freight",
    fcl: "ocean-fcl",
    lcl: "ocean-lcl",
    "door-to-door": "ddp-door-to-door",
    ddp: "ddp-door-to-door",
    oversized: "oversized-cargo",
    "oversized-cargo-shipping": "oversized-cargo",
    "express-shipping": "express"
  };
  const cleaned = cleanString(value, FIELD_LIMITS.service).toLowerCase();
  const normalized = aliases[cleaned] || cleaned;
  return SERVICE_LABELS[normalized] ? normalized : "not-sure";
}

function normalizeShippingMethod(value, legacyService = "") {
  const aliases = {
    sea: "ocean-freight",
    ocean: "ocean-freight",
    "sea-freight": "ocean-freight",
    "sea-freight-china-to-usa": "ocean-freight",
    fcl: "ocean-fcl",
    lcl: "ocean-lcl",
    air: "air-freight",
    "air-freight-china-to-usa": "air-freight",
    courier: "express",
    "express-shipping": "express",
    "not-sure-please-recommend": "not-sure"
  };
  const requested = cleanString(value || legacyService, FIELD_LIMITS.shipping_method).toLowerCase();
  const normalized = aliases[requested] || requested;
  return SHIPPING_METHOD_LABELS[normalized] ? normalized : "not-sure";
}

function serviceNeedsFromLegacyService(value) {
  const service = normalizeService(value);
  const mappings = {
    "amazon-fba": ["shipping", "fba-prep-labeling"],
    "supplier-consolidation": ["supplier-pickup", "consolidation"],
    "china-pickup": ["supplier-pickup"],
    warehousing: ["warehousing"],
    "ocean-freight": ["shipping"],
    "ocean-fcl": ["shipping"],
    "ocean-lcl": ["shipping"],
    "air-freight": ["shipping"],
    "ddp-door-to-door": ["shipping"],
    "customs-clearance": ["shipping"],
    "final-delivery": ["shipping"],
    "oversized-cargo": ["shipping"],
    express: ["shipping"]
  };
  return mappings[service] || ["not-sure"];
}

export function normalizeServiceNeeds(value, legacyService = "") {
  const aliases = {
    pickup: "supplier-pickup",
    "china-pickup": "supplier-pickup",
    "supplier-consolidation": "consolidation",
    storage: "warehousing",
    "amazon-fba": "fba-prep-labeling",
    "fba-prep": "fba-prep-labeling",
    labeling: "fba-prep-labeling",
    kitting: "kitting-light-assembly",
    assembly: "kitting-light-assembly",
    "receiving-checks": "inspection",
    "not-sure-please-recommend": "not-sure"
  };
  const rawValues = Array.isArray(value)
    ? value
    : String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  const normalized = [...new Set(rawValues
    .map((item) => cleanString(String(item), 80).toLowerCase())
    .map((item) => aliases[item] || item)
    .filter((item) => SERVICE_NEED_LABELS[item]))];

  const withLegacyFallback = normalized.length > 0
    ? normalized
    : serviceNeedsFromLegacyService(legacyService);
  const concreteNeeds = withLegacyFallback.filter((item) => item !== "not-sure");
  return concreteNeeds.length > 0 ? concreteNeeds : ["not-sure"];
}

function normalizePreferredContact(value) {
  const normalized = cleanString(value, FIELD_LIMITS.preferred_contact).toLowerCase();
  return PREFERRED_CONTACT_VALUES.has(normalized) ? normalized : "email";
}

function safeUrl(value, { allowExternal = false, originOnly = false } = {}) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";

    const isSiteHost =
      url.hostname === "gdlogi.us" ||
      url.hostname === "www.gdlogi.us" ||
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1";
    if (!allowExternal && !isSiteHost) return "";

    if (originOnly) return url.origin.slice(0, FIELD_LIMITS.referrer);
    return `${url.origin}${url.pathname}`.slice(0, FIELD_LIMITS.source_page);
  } catch {
    return "";
  }
}

function normalizeSourcePage(value, request) {
  const fallback = request.headers.get("referer") || "https://gdlogi.us/";
  return safeUrl(value) || safeUrl(fallback) || "https://gdlogi.us/";
}

function normalizeReferrer(value) {
  return safeUrl(value, { allowExternal: true, originOnly: true });
}

function normalizeAttribution(value, maxLength) {
  const cleaned = cleanString(value, maxLength).normalize("NFKC");
  if (/[@?&=]|:\/\//.test(cleaned)) return "";
  return cleaned
    .replace(/[^a-zA-Z0-9 _.-]/g, "")
    .replace(/\s+/g, " ");
}

export function normalizePayload(raw, request) {
  const legacyAliases = {
    whatsapp: raw.whatsapp || raw.phone,
    origin: raw.origin || raw.origin_city,
    weight: raw.weight || raw.total_weight || raw.cargo_volume_weight,
    volume: raw.volume || raw.total_volume,
    service: raw.service || raw.shipping_method,
    shipping_method: raw.shipping_method || raw.transport_mode,
    message: raw.message || raw.additional_requirements,
    source_type: raw.source_type || raw.source,
    product_name: raw.product_name || raw.product || raw.requirement
  };
  const merged = { ...raw, ...legacyAliases };
  const normalized = {};

  for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
    normalized[field] = cleanString(merged[field], limit);
  }

  normalized.email = normalized.email.normalize("NFKC").toLowerCase();
  normalized.whatsapp = normalizePhone(normalized.whatsapp);
  normalized.service = normalizeService(normalized.service);
  normalized.shipping_method = normalizeShippingMethod(
    merged.shipping_method,
    normalized.service
  );
  normalized.service_needs = normalizeServiceNeeds(raw.service_needs, normalized.service);
  normalized.preferred_contact = normalizePreferredContact(normalized.preferred_contact);
  normalized.source_page = normalizeSourcePage(normalized.source_page || raw.page_url, request);
  normalized.referrer = normalizeReferrer(normalized.referrer);
  normalized.utm_source = normalizeAttribution(normalized.utm_source, FIELD_LIMITS.utm_source);
  normalized.utm_medium = normalizeAttribution(normalized.utm_medium, FIELD_LIMITS.utm_medium);
  normalized.utm_campaign = normalizeAttribution(
    normalized.utm_campaign,
    FIELD_LIMITS.utm_campaign
  );
  normalized.source_type = SOURCE_LABELS[normalized.source_type]
    ? normalized.source_type
    : "quote-page";

  return normalized;
}

export function validatePayload(payload) {
  const errors = {};

  if (!isValidEmail(payload.email)) errors.email = "Enter a valid email address.";
  if (payload.whatsapp && !isValidPhone(payload.whatsapp)) {
    errors.whatsapp = "Enter a valid phone or WhatsApp number.";
  }
  if (payload.preferred_contact === "whatsapp" && !payload.whatsapp) {
    errors.whatsapp = "Phone or WhatsApp is required for WhatsApp replies.";
  }
  if (payload.privacy_consent !== "agreed") {
    errors.privacy_consent = "Privacy consent is required.";
  }
  if (!Array.isArray(payload.service_needs) || payload.service_needs.length === 0) {
    errors.service_needs = "Choose at least one service need or ask us to advise.";
  }
  if (!payload.name) errors.name = "Name is required.";
  if (!payload.product_name) {
    errors.product_name = "Product name or description is required.";
  }
  if (["quote-page", "service-page"].includes(payload.source_type)) {
    if (!payload.origin) errors.origin = "Origin is required.";
    if (!payload.destination) errors.destination = "Destination is required.";
  }
  if (payload.source_type === "homepage-quick-quote") {
    if (!payload.origin) errors.origin = "Origin is required.";
    if (!payload.destination) errors.destination = "Destination is required.";
  }

  return errors;
}

export function providerRequiresActivation(providerResult) {
  if (!providerResult || typeof providerResult !== "object") return false;
  const message = `${providerResult.message || ""} ${providerResult.error || ""}`;
  return /activat|confirm(?:ation)?\s+(?:your\s+)?email|email\s+confirm/i.test(message);
}

export function providerExplicitlyAccepted(providerResult) {
  if (!providerResult || typeof providerResult !== "object") return false;
  return (
    providerResult.success === true ||
    providerResult.success === "true" ||
    providerResult.accepted === true ||
    providerResult.submission_status === "SUCCESS"
  );
}

export function providerExplicitlyRejected(providerResult) {
  if (!providerResult || typeof providerResult !== "object") return false;
  const errorValue = providerResult.error;
  const errorsValue = providerResult.errors;
  const hasError =
    (typeof errorValue === "string" && errorValue.trim() !== "") ||
    (Array.isArray(errorValue) && errorValue.length > 0) ||
    (errorValue && typeof errorValue === "object" && Object.keys(errorValue).length > 0);
  const hasErrors =
    (typeof errorsValue === "string" && errorsValue.trim() !== "") ||
    (Array.isArray(errorsValue) && errorsValue.length > 0) ||
    (errorsValue && typeof errorsValue === "object" && Object.keys(errorsValue).length > 0);
  return (
    providerResult.ok === false ||
    providerResult.success === false ||
    providerResult.success === "false" ||
    providerResult.accepted === false ||
    providerResult.submission_status === "FAILED" ||
    String(providerResult.status || "").toLowerCase() === "failed" ||
    String(providerResult.status || "").toLowerCase() === "rejected" ||
    hasError ||
    hasErrors
  );
}

export function buildProviderPayload(payload, submissionId) {
  const sourceLabel = SOURCE_LABELS[payload.source_type];
  const shippingMethodLabel = SHIPPING_METHOD_LABELS[payload.shipping_method];
  const serviceNeedLabels = payload.service_needs.map((item) => SERVICE_NEED_LABELS[item]);
  const serviceNeedsSummary = serviceNeedLabels.length > 2
    ? `${serviceNeedLabels.slice(0, 2).join(" + ")} +${serviceNeedLabels.length - 2}`
    : serviceNeedLabels.join(" + ");
  const testMarker = "GDLOGI TEST INQUIRY — DO NOT PROCESS";
  const isTest = Object.values(payload).some(
    (value) => typeof value === "string" && value.includes(testMarker)
  );
  const subjectPrefix = isTest ? "[GDLOGI TEST — DO NOT PROCESS]" : "[GDLOGI Inquiry]";

  const providerPayload = {
    _subject: `${subjectPrefix} ${sourceLabel} | ${serviceNeedsSummary} | ${submissionId}`,
    _template: "table",
    _next: "https://gdlogi.us/thank-you/",
    _replyto: payload.email,
    _url: payload.source_page,
    _honey: "",
    submission_id: submissionId,
    name: payload.name,
    company: payload.company,
    email: payload.email,
    whatsapp: payload.whatsapp,
    origin: payload.origin,
    destination: payload.destination,
    product_name: payload.product_name,
    cargo_type: payload.cargo_type,
    weight: payload.weight,
    volume: payload.volume,
    shipping_method: shippingMethodLabel,
    service_needs: serviceNeedLabels.join(", "),
    service: serviceNeedLabels.join(", "),
    message: payload.message,
    source_page: payload.source_page,
    source_type: payload.source_type,
    product_id: payload.product_id,
    package_count: payload.package_count,
    dimensions: payload.dimensions,
    cargo_ready_date: payload.cargo_ready_date,
    preferred_contact: payload.preferred_contact,
    privacy_consent: payload.privacy_consent,
    referrer: payload.referrer,
    utm_source: payload.utm_source,
    utm_medium: payload.utm_medium,
    utm_campaign: payload.utm_campaign
  };

  return Object.fromEntries(
    Object.entries(providerPayload).filter(([field, value]) => field.startsWith("_") || value !== "")
  );
}

export async function submitToProvider({
  endpoint,
  payload,
  submissionId,
  timeoutMs,
  fetchImpl = fetch
}) {
  let providerResponse;
  try {
    providerResponse = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: "https://gdlogi.us",
        Referer: payload.source_page
      },
      body: JSON.stringify(buildProviderPayload(payload, submissionId)),
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

  const providerContentType = providerResponse.headers.get("content-type") || "";
  const isJsonResponse =
    providerContentType.includes("application/json") || providerContentType.includes("+json");
  if (!isJsonResponse) {
    return { submissionStatus: "PENDING", code: "PROVIDER_RESPONSE_UNKNOWN" };
  }

  let providerText;
  try {
    providerText = await providerResponse.text();
  } catch {
    return { submissionStatus: "PENDING", code: "PROVIDER_RESPONSE_UNKNOWN" };
  }

  let providerResult;
  try {
    providerResult = JSON.parse(providerText);
  } catch {
    return { submissionStatus: "PENDING", code: "PROVIDER_RESPONSE_UNKNOWN" };
  }

  if (providerRequiresActivation(providerResult)) {
    return { submissionStatus: "FAILED", code: "ACTIVATION_REQUIRED" };
  }
  if (providerExplicitlyRejected(providerResult)) {
    return { submissionStatus: "FAILED", code: "PROVIDER_REJECTED" };
  }
  if (providerResponse.ok && providerExplicitlyAccepted(providerResult)) {
    return { submissionStatus: "SUCCESS", code: "PROVIDER_ACCEPTED" };
  }

  return { submissionStatus: "PENDING", code: "PROVIDER_RESPONSE_UNKNOWN" };
}
