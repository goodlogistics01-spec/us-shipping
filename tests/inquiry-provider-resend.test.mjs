import assert from "node:assert/strict";
import test from "node:test";

import {
  buildResendEmail,
  RESEND_EMAIL_ENDPOINT,
  submitViaResend
} from "../app/lib/inquiry-provider-resend.mjs";
import { normalizePayload } from "../app/lib/inquiry-server.mjs";

const requestStub = {
  headers: new Headers({ referer: "https://gdlogi.us/quote/" })
};

function validPayload(overrides = {}) {
  return normalizePayload(
    {
      source_type: "quote-page",
      name: "Acceptance User",
      company: "Acceptance Company",
      email: "buyer@example.com",
      whatsapp: "+1 213 555 0188",
      preferred_contact: "email",
      product_name: "Commercial display samples",
      origin: "Shenzhen",
      destination_country: "United States",
      destination: "Los Angeles, CA 90001",
      cargo_type: "General cargo in cartons",
      weight: "1,250 kg",
      volume: "6.8 CBM",
      package_count: "12 cartons",
      dimensions: "60 x 40 x 35 cm",
      cargo_ready_date: "2026-12-01",
      service: "sea-freight",
      shipping_method: "ocean-freight",
      service_needs: ["shipping", "consolidation", "inspection"],
      inspection_types: ["receiving-checks", "product-quality-inspection"],
      message: "Please review pickup and delivery scope.",
      privacy_consent: "agreed",
      form_schema_version: "2",
      source_page: "https://gdlogi.us/quote/",
      referrer: "https://example.com/path",
      utm_source: "release_acceptance",
      utm_medium: "manual",
      utm_campaign: "provider_migration",
      ...overrides
    },
    requestStub
  );
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" }
  });
}

test("Resend email retains the complete inquiry body and safe routing headers", () => {
  const email = buildResendEmail({
    payload: validPayload(),
    submissionId: "GL-20261123-RESEND01",
    fromEmail: "GOOD LOGISTICS Website <website@mail.gdlogi.com>\r\nBcc: bad@example.com",
    toEmail: "zoe@gdlogi.com\r\nBcc: bad@example.com",
    submittedAt: new Date("2026-11-23T00:00:00.000Z")
  });

  assert.equal(email.reply_to, "buyer@example.com");
  assert.equal(email.from.includes("\n"), false);
  assert.equal(email.to[0].includes("\n"), false);
  assert.match(email.subject, /GL-20261123-RESEND01/);
  for (const expected of [
    "Submission ID: GL-20261123-RESEND01",
    "Submitted at (UTC): 2026-11-23T00:00:00.000Z",
    "Destination country: United States",
    "Destination city / postal code / warehouse: Los Angeles, CA 90001",
    "Service needs: Shipping, Consolidation, Inspection",
    "Inspection types: Receiving Checks",
    "Product Quality Inspection",
    "Inspection scope:",
    "UTM campaign: provider_migration"
  ]) {
    assert.match(email.text, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("Resend request uses the fixed endpoint, server credentials, Reply-To and stable idempotency key", async () => {
  let captured;
  const outcome = await submitViaResend({
    apiKey: "re_secret_value",
    fromEmail: "GOOD LOGISTICS Website <website@mail.gdlogi.com>",
    toEmail: "zoe@gdlogi.com",
    payload: validPayload(),
    submissionId: "GL-20261123-RESEND02",
    timeoutMs: 1_000,
    fetchImpl: async (url, options) => {
      captured = { url, options };
      return jsonResponse({ id: "re_message_123" });
    }
  });

  assert.equal(captured.url, RESEND_EMAIL_ENDPOINT);
  assert.equal(captured.options.headers.Authorization, "Bearer re_secret_value");
  assert.equal(
    captured.options.headers["Idempotency-Key"],
    "inquiry-notification/GL-20261123-RESEND02"
  );
  const body = JSON.parse(captured.options.body);
  assert.deepEqual(body.to, ["zoe@gdlogi.com"]);
  assert.equal(body.reply_to, "buyer@example.com");
  assert.equal(outcome.submissionStatus, "SUCCESS");
  assert.equal(outcome.providerMessageId, "re_message_123");
});

test("Resend accepts only a 2xx JSON response with a valid provider id", async () => {
  for (const [response, expected] of [
    [jsonResponse({ id: "re_valid_123" }, 200), "SUCCESS"],
    [jsonResponse({ id: "re_valid_123" }, 201), "SUCCESS"],
    [jsonResponse({ id: "re_valid_123" }, 202), "PENDING"],
    [jsonResponse({}, 200), "PENDING"],
    [jsonResponse({ id: "bad id" }, 200), "PENDING"],
    [new Response("ok", { status: 200, headers: { "content-type": "text/plain" } }), "PENDING"]
  ]) {
    const outcome = await submitViaResend({
      apiKey: "re_secret_value",
      fromEmail: "website@mail.gdlogi.com",
      toEmail: "zoe@gdlogi.com",
      payload: validPayload(),
      submissionId: "GL-20261123-RESEND03",
      timeoutMs: 1_000,
      fetchImpl: async () => response
    });
    assert.equal(outcome.submissionStatus, expected);
  }
});

test("Resend maps explicit rejection, rate limit and uncertain upstream states conservatively", async () => {
  for (const [status, expectedStatus, expectedCode] of [
    [400, "FAILED", "PROVIDER_REJECTED"],
    [401, "FAILED", "PROVIDER_REJECTED"],
    [422, "FAILED", "PROVIDER_REJECTED"],
    [429, "FAILED", "PROVIDER_RATE_LIMITED"],
    [500, "PENDING", "PROVIDER_RESPONSE_UNKNOWN"],
    [503, "PENDING", "PROVIDER_RESPONSE_UNKNOWN"]
  ]) {
    const outcome = await submitViaResend({
      apiKey: "re_secret_value",
      fromEmail: "website@mail.gdlogi.com",
      toEmail: "zoe@gdlogi.com",
      payload: validPayload(),
      submissionId: `GL-20261123-${status}`,
      timeoutMs: 1_000,
      fetchImpl: async () => jsonResponse({ error: "redacted" }, status)
    });
    assert.equal(outcome.submissionStatus, expectedStatus);
    assert.equal(outcome.code, expectedCode);
  }
});

test("Resend keeps timeout and network uncertainty pending without retrying", async () => {
  let calls = 0;
  for (const [errorName, expectedCode] of [
    ["TimeoutError", "PROVIDER_TIMEOUT"],
    ["TypeError", "PROVIDER_NETWORK_ERROR"]
  ]) {
    const outcome = await submitViaResend({
      apiKey: "re_secret_value",
      fromEmail: "website@mail.gdlogi.com",
      toEmail: "zoe@gdlogi.com",
      payload: validPayload(),
      submissionId: `GL-20261123-${errorName}`,
      timeoutMs: 1_000,
      fetchImpl: async () => {
        calls += 1;
        const error = new Error("redacted provider failure");
        error.name = errorName;
        throw error;
      }
    });
    assert.equal(outcome.submissionStatus, "PENDING");
    assert.equal(outcome.code, expectedCode);
  }
  assert.equal(calls, 2);
});
