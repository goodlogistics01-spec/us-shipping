const SAFE_IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/;

function safeIdentifier(value) {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  return SAFE_IDENTIFIER.test(normalized) ? normalized : undefined;
}

function safeHttpStatus(value) {
  const status = Number(value);
  return Number.isInteger(status) && status >= 100 && status <= 599
    ? status
    : undefined;
}

function compactRecord(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined)
  );
}

export function createInquiryOutcomeAuditEvent(
  outcome,
  {
    event = "gdlogi.inquiry.delivery_outcome",
    environment,
    replayed = false
  } = {}
) {
  const submissionStatus = safeIdentifier(outcome?.submissionStatus);
  const derivedHttpStatus = submissionStatus === "SUCCESS"
    ? 200
    : submissionStatus === "PENDING"
      ? 202
      : 502;

  return compactRecord({
    event: safeIdentifier(event) || "gdlogi.inquiry.delivery_outcome",
    submission_id: safeIdentifier(outcome?.submissionId),
    submission_status: submissionStatus,
    code: safeIdentifier(outcome?.code),
    http_status: safeHttpStatus(outcome?.httpStatus) || derivedHttpStatus,
    lead_store_status: safeIdentifier(outcome?.leadStoreStatus),
    lead_store_code: safeIdentifier(outcome?.leadStoreCode),
    lead_store_request_id: safeIdentifier(outcome?.leadStoreRequestId),
    notification_status: safeIdentifier(outcome?.notificationStatus),
    notification_code: safeIdentifier(outcome?.notificationCode),
    idempotency_replayed: replayed === true ? true : undefined,
    vercel_env: safeIdentifier(environment)
  });
}

export function createInquiryResponseAuditEvent(
  body,
  httpStatus,
  { environment } = {}
) {
  return compactRecord({
    event: "gdlogi.inquiry.response",
    submission_id: safeIdentifier(body?.submission_id),
    submission_status: safeIdentifier(body?.submission_status),
    code: safeIdentifier(body?.code),
    http_status: safeHttpStatus(httpStatus),
    idempotency_replayed: body?.idempotency_replayed === true ? true : undefined,
    vercel_env: safeIdentifier(environment)
  });
}

export function emitInquiryAudit(logger, event) {
  if (typeof logger !== "function") return;
  try {
    logger(event);
  } catch {
    // Diagnostics must never change inquiry delivery semantics.
  }
}
