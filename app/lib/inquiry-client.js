export const INQUIRY_FAILURE_MESSAGE =
  "We couldn’t send your inquiry. Please try again or contact us by WhatsApp or email.";

export const INQUIRY_PENDING_MESSAGE =
  "We could not confirm delivery yet. This request has not been counted as accepted and will not be sent again automatically.";

const CLIENT_RESPONSE_TIMEOUT_MS = 32_000;

export function formDataToInquiryPayload(formData) {
  const payload = {};

  for (const [name, value] of formData.entries()) {
    if (name === "service_needs") {
      payload.service_needs = [...(payload.service_needs || []), value];
      continue;
    }
    payload[name] = value;
  }

  return payload;
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
    let response;
    try {
      response = await fetch("/api/inquiry/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formDataToInquiryPayload(new FormData(form))),
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
