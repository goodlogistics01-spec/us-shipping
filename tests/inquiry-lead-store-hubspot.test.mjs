import assert from "node:assert/strict";
import test from "node:test";

import {
  buildHubSpotInquiryDetails,
  buildHubSpotSubmissionBody,
  DEFAULT_HUBSPOT_FIELD_MAP,
  resolveHubSpotSubmissionEndpoint,
  storeInquiryInHubSpot
} from "../app/lib/inquiry-lead-store-hubspot.mjs";
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

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers }
  });
}

function storeOptions(overrides = {}) {
  return {
    portalId: "12345678",
    formGuid: "a1234567-b123-c123-d123-e12345678901",
    accessToken: "pat-na1-redacted-test-token",
    payload: validPayload(),
    submissionId: "GL-20261123-HUBSPOT01",
    submittedAt: new Date("2026-11-23T00:00:00.000Z"),
    timeoutMs: 1_000,
    ...overrides
  };
}

test("HubSpot endpoint is fixed to the authenticated official host", () => {
  assert.equal(
    resolveHubSpotSubmissionEndpoint({
      portalId: "12345678",
      formGuid: "a1234567-b123-c123-d123-e12345678901"
    }),
    "https://api.hsforms.com/submissions/v3/integration/secure/submit/12345678/a1234567-b123-c123-d123-e12345678901"
  );
  assert.equal(
    resolveHubSpotSubmissionEndpoint({
      portalId: "12345678",
      formId: "a1234567-b123-c123-d123-e12345678901"
    }),
    "https://api.hsforms.com/submissions/v3/integration/secure/submit/12345678/a1234567-b123-c123-d123-e12345678901"
  );
  assert.throws(() =>
    resolveHubSpotSubmissionEndpoint({
      portalId: "https://attacker.example",
      formGuid: "a1234567-b123-c123-d123-e12345678901"
    })
  );
});

test("HubSpot details retain every inquiry field and both inspection scopes", () => {
  const details = buildHubSpotInquiryDetails({
    payload: validPayload(),
    submissionId: "GL-20261123-HUBSPOT02",
    submittedAt: new Date("2026-11-23T00:00:00.000Z")
  });

  for (const expected of [
    "Submission ID: GL-20261123-HUBSPOT02",
    "Submitted at (UTC): 2026-11-23T00:00:00.000Z",
    "Destination country: United States",
    "Destination city / postal code / warehouse: Los Angeles, CA 90001",
    "Service needs: Shipping, Consolidation, Inspection",
    "Inspection types: Receiving Checks",
    "Product Quality Inspection",
    "Inspection scope:",
    "UTM campaign: provider_migration",
    "Form schema version: 2"
  ]) {
    assert.match(details, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("HubSpot body maps standard contact fields and one complete details field", () => {
  const body = buildHubSpotSubmissionBody({
    payload: validPayload(),
    submissionId: "GL-20261123-HUBSPOT03",
    submittedAt: new Date("2026-11-23T00:00:00.000Z"),
    consentText: "Good Logistics may use these details to respond to this request."
  });

  assert.equal(body.submittedAt, "1795392000000");
  assert.deepEqual(
    body.fields.map(({ objectTypeId, name }) => [objectTypeId, name]),
    [
      ["0-1", DEFAULT_HUBSPOT_FIELD_MAP.name],
      ["0-1", DEFAULT_HUBSPOT_FIELD_MAP.email],
      ["0-1", DEFAULT_HUBSPOT_FIELD_MAP.company],
      ["0-1", DEFAULT_HUBSPOT_FIELD_MAP.whatsapp],
      ["0-1", DEFAULT_HUBSPOT_FIELD_MAP.details]
    ]
  );
  assert.equal(body.context.pageUri, "https://gdlogi.us/quote/");
  assert.equal(body.legalConsentOptions.consent.consentToProcess, true);
  assert.match(
    body.fields.find((field) => field.name === DEFAULT_HUBSPOT_FIELD_MAP.details).value,
    /Product \/ goods: Commercial display samples/
  );
});

test("HubSpot field mapping is configurable, stable and rejects ambiguous mappings", () => {
  const body = buildHubSpotSubmissionBody({
    payload: validPayload(),
    submissionId: "GL-20261123-HUBSPOT04",
    fieldMap: {
      name: "contact_first_name",
      details: "website_inquiry_details"
    }
  });

  assert.equal(body.fields[0].name, "contact_first_name");
  assert.equal(body.fields.at(-1).name, "website_inquiry_details");
  assert.throws(() =>
    buildHubSpotSubmissionBody({
      payload: validPayload(),
      submissionId: "GL-20261123-HUBSPOT05",
      fieldMap: { details: "email" }
    })
  );
  assert.throws(() =>
    buildHubSpotSubmissionBody({
      payload: validPayload(),
      submissionId: "GL-20261123-HUBSPOT06",
      fieldMap: { unsupported: "silently_dropped" }
    })
  );
});

test("HubSpot request is server-authenticated and explicit accepted JSON is success", async () => {
  let captured;
  const outcome = await storeInquiryInHubSpot(
    storeOptions({
      fetchImpl: async (url, options) => {
        captured = { url, options };
        return jsonResponse(
          {
            inlineMessage: "Thanks",
            submissionId: "hs-submission-123"
          },
          200,
          { "x-hubspot-correlation-id": "correlation-123" }
        );
      }
    })
  );

  assert.equal(
    captured.url,
    "https://api.hsforms.com/submissions/v3/integration/secure/submit/12345678/a1234567-b123-c123-d123-e12345678901"
  );
  assert.equal(
    captured.options.headers.Authorization,
    "Bearer pat-na1-redacted-test-token"
  );
  assert.equal(outcome.submissionStatus, "SUCCESS");
  assert.equal(outcome.code, "HUBSPOT_ACCEPTED");
  assert.equal(outcome.providerLeadId, "hs-submission-123");
  assert.equal(outcome.providerRequestId, "correlation-123");
});

test("HubSpot missing configuration fails before any provider request", async () => {
  let calls = 0;
  const outcome = await storeInquiryInHubSpot(
    storeOptions({
      accessToken: "",
      fetchImpl: async () => {
        calls += 1;
        return jsonResponse({ inlineMessage: "Thanks" });
      }
    })
  );

  assert.equal(calls, 0);
  assert.equal(outcome.submissionStatus, "FAILED");
  assert.equal(outcome.code, "HUBSPOT_CONFIGURATION_ERROR");
});

test("HubSpot maps 4xx and form-definition rejection to explicit failure", async () => {
  for (const [response, expectedCode] of [
    [jsonResponse({ category: "VALIDATION_ERROR" }, 400), "HUBSPOT_REJECTED"],
    [
      jsonResponse(
        { errors: [{ errorType: "FIELD_NOT_IN_FORM_DEFINITION" }] },
        400
      ),
      "HUBSPOT_FORM_FIELD_REJECTED"
    ],
    [jsonResponse({ category: "RATE_LIMITS" }, 429), "HUBSPOT_RATE_LIMITED"]
  ]) {
    const outcome = await storeInquiryInHubSpot(
      storeOptions({ fetchImpl: async () => response })
    );
    assert.equal(outcome.submissionStatus, "FAILED");
    assert.equal(outcome.code, expectedCode);
  }
});

test("HubSpot keeps 202, 5xx and invalid successful responses pending", async () => {
  for (const response of [
    jsonResponse({ inlineMessage: "Queued" }, 202),
    jsonResponse({ category: "SERVER_ERROR" }, 500),
    jsonResponse({ category: "SERVER_ERROR" }, 503),
    jsonResponse({}, 200),
    jsonResponse({ inlineMessage: "" }, 200),
    new Response("accepted", {
      status: 200,
      headers: { "content-type": "text/plain" }
    }),
    new Response("{not-json", {
      status: 200,
      headers: { "content-type": "application/json" }
    })
  ]) {
    const outcome = await storeInquiryInHubSpot(
      storeOptions({ fetchImpl: async () => response })
    );
    assert.equal(outcome.submissionStatus, "PENDING");
  }
});

test("HubSpot accepts an explicit 2xx response marker and no bare 2xx", async () => {
  const accepted = await storeInquiryInHubSpot(
    storeOptions({
      fetchImpl: async () => jsonResponse({ redirectUri: "https://gdlogi.us/thank-you/" }, 201)
    })
  );
  const ambiguous = await storeInquiryInHubSpot(
    storeOptions({ fetchImpl: async () => jsonResponse({ status: "ok" }, 200) })
  );

  assert.equal(accepted.submissionStatus, "SUCCESS");
  assert.equal(ambiguous.submissionStatus, "PENDING");
  assert.equal(ambiguous.code, "HUBSPOT_RESPONSE_UNKNOWN");
});

test("HubSpot timeout and network uncertainty remain pending without retries", async () => {
  let calls = 0;
  for (const [errorName, expectedCode] of [
    ["TimeoutError", "HUBSPOT_TIMEOUT"],
    ["TypeError", "HUBSPOT_NETWORK_ERROR"]
  ]) {
    const outcome = await storeInquiryInHubSpot(
      storeOptions({
        fetchImpl: async () => {
          calls += 1;
          const error = new Error("redacted provider failure");
          error.name = errorName;
          throw error;
        }
      })
    );
    assert.equal(outcome.submissionStatus, "PENDING");
    assert.equal(outcome.code, expectedCode);
  }
  assert.equal(calls, 2);
});
