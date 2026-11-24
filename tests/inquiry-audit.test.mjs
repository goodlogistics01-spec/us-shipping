import assert from "node:assert/strict";
import test from "node:test";

import {
  createInquiryOutcomeAuditEvent,
  createInquiryResponseAuditEvent,
  emitInquiryAudit
} from "../app/lib/inquiry-audit.mjs";

test("outcome audit events keep operational identifiers and drop private payload data", () => {
  const event = createInquiryOutcomeAuditEvent(
    {
      submissionStatus: "FAILED",
      submissionId: "GL-20261124-ABC12345",
      code: "HUBSPOT_FORM_FIELD_REJECTED",
      httpStatus: 502,
      leadStoreStatus: "FAILED",
      leadStoreCode: "HUBSPOT_FORM_FIELD_REJECTED",
      leadStoreRequestId: "hubspot-correlation-123",
      notificationStatus: "NOT_ATTEMPTED",
      email: "buyer@example.com",
      name: "Private Buyer",
      company: "Private Company",
      whatsapp: "+1 202 555 0100",
      origin: "Private origin",
      destination: "Private destination",
      referrer: "https://private.example/path",
      utm_campaign: "private-campaign",
      idempotency_key: "inq-private",
      accessToken: "pat-private-token",
      message: "Private cargo notes"
    },
    { environment: "preview" }
  );

  assert.deepEqual(event, {
    event: "gdlogi.inquiry.delivery_outcome",
    submission_id: "GL-20261124-ABC12345",
    submission_status: "FAILED",
    code: "HUBSPOT_FORM_FIELD_REJECTED",
    http_status: 502,
    lead_store_status: "FAILED",
    lead_store_code: "HUBSPOT_FORM_FIELD_REJECTED",
    lead_store_request_id: "hubspot-correlation-123",
    notification_status: "NOT_ATTEMPTED",
    vercel_env: "preview"
  });
  assert.doesNotMatch(
    JSON.stringify(event),
    /buyer@example|Private Buyer|Private Company|555|Private origin|Private destination|private\.example|private-campaign|inq-private|pat-private|cargo notes/
  );
});

test("response audit events use a strict allowlist and logger failures are harmless", () => {
  const event = createInquiryResponseAuditEvent(
    {
      submission_status: "FAILED",
      submission_id: "GL-20261124-ABC12345",
      code: "HUBSPOT_REJECTED",
      message: "Do not log this provider message",
      errors: { email: "Private validation detail" }
    },
    502,
    { environment: "preview" }
  );

  assert.deepEqual(event, {
    event: "gdlogi.inquiry.response",
    submission_id: "GL-20261124-ABC12345",
    submission_status: "FAILED",
    code: "HUBSPOT_REJECTED",
    http_status: 502,
    vercel_env: "preview"
  });
  assert.doesNotThrow(() => emitInquiryAudit(() => {
    throw new Error("logger unavailable");
  }, event));
});
