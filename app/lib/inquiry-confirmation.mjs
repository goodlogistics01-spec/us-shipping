export const INQUIRY_REQUEST_ID_PATTERN = /^GL-\d{8}-[A-F0-9]{8}$/;

export function normalizeInquiryRequestId(value) {
  const requestId = Array.isArray(value) ? value[0] : value;
  return INQUIRY_REQUEST_ID_PATTERN.test(String(requestId || ""))
    ? String(requestId)
    : "";
}

export function inquiryConfirmationCookieName(requestId) {
  const normalized = normalizeInquiryRequestId(requestId);
  return normalized ? `gdlogi_inquiry_accepted_${normalized}` : "";
}

export function isConfirmedInquiryRequest(requestId, cookieValue) {
  const normalized = normalizeInquiryRequestId(requestId);
  return Boolean(normalized && cookieValue === normalized);
}
