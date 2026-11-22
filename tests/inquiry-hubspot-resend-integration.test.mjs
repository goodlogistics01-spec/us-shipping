import assert from "node:assert/strict";
import test from "node:test";

import {
  handleInquiryRequest,
  resolveDeliveryConfiguration
} from "../app/lib/inquiry-endpoint.mjs";
import { createMemoryInquiryStateStore } from "../app/lib/inquiry-state-store.mjs";

const NOW = new Date("2026-11-23T08:00:00.000Z");
const UUID = "87654321-1234-4123-8123-123456789abc";
const HUBSPOT_HOST = "api.hsforms.com";
const RESEND_URL = "https://api.resend.com/emails";

function key(number = 1) {
  return `inq-${number.toString(16).padStart(64, "0")}`;
}

function validBody(overrides = {}) {
  return {
    source_type: "quote-page",
    name: "Preview Acceptance",
    company: "Non-customer test",
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
    message: "TEST only — do not process.",
    privacy_consent: "agreed",
    form_schema_version: "2",
    source_page: "https://preview.example/quote/",
    utm_source: "release_acceptance",
    utm_medium: "manual",
    utm_campaign: "hubspot_resend_preview",
    ...overrides
  };
}

function request(body = validBody(), requestKey = key()) {
  return new Request("https://preview.example/api/inquiry/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Idempotency-Key": requestKey,
      "x-forwarded-for": "203.0.113.50"
    },
    body: JSON.stringify({ ...body, idempotency_key: requestKey })
  });
}

function previewEnv(overrides = {}) {
  return {
    INQUIRY_DELIVERY_MODE: "hubspot-resend",
    VERCEL_ENV: "preview",
    INQUIRY_ALLOW_REAL_PROVIDER_PREVIEW: "true",
    HUBSPOT_PORTAL_ID: "12345678",
    HUBSPOT_FORM_GUID: "a1234567-b123-c123-d123-e12345678901",
    HUBSPOT_ACCESS_TOKEN: "pat-redacted-test-token",
    HUBSPOT_DETAILS_FIELD: "gdlogi_inquiry_details",
    RESEND_API_KEY: "re_redacted_test_key",
    RESEND_FROM_EMAIL: "GOOD LOGISTICS Website <website@mail.gdlogi.com>",
    INQUIRY_TO_EMAIL: "zoe@gdlogi.com",
    ...overrides
  };
}

function harness({ env = previewEnv(), store, fetchImpl } = {}) {
  return {
    env,
    stateStore: store || createMemoryInquiryStateStore(),
    stateKeySecret: "preview-integration-test-key",
    fetchImpl,
    now: () => NOW,
    uuidFactory: () => UUID,
    ownerTokenFactory: () => "preview-owner-token"
  };
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers }
  });
}

function acceptedHubSpot() {
  return json(
    { inlineMessage: "Thanks" },
    200,
    { "x-hubspot-correlation-id": "hubspot-correlation-123" }
  );
}

test("Preview HubSpot + Resend mode is explicit, scoped, and fail-closed", () => {
  const previewRequest = request();
  assert.equal(resolveDeliveryConfiguration(previewRequest, previewEnv()).ok, true);
  assert.equal(
    resolveDeliveryConfiguration(previewRequest, previewEnv({
      INQUIRY_ALLOW_REAL_PROVIDER_PREVIEW: "false"
    })).ok,
    false
  );
  assert.equal(
    resolveDeliveryConfiguration(previewRequest, previewEnv({
      VERCEL_ENV: "production",
      INQUIRY_ALLOW_REAL_PROVIDER_PREVIEW: "true"
    })).ok,
    false
  );
  assert.equal(
    resolveDeliveryConfiguration(previewRequest, previewEnv({ RESEND_API_KEY: "" })).ok,
    false
  );
  assert.equal(
    resolveDeliveryConfiguration(previewRequest, previewEnv({
      INQUIRY_TO_EMAIL: "attacker@example.com"
    })).ok,
    false
  );
});

test("missing dual-provider configuration returns 503 before any external call", async () => {
  let calls = 0;
  const response = await handleInquiryRequest(
    request(validBody(), key(2)),
    harness({
      env: previewEnv({ HUBSPOT_ACCESS_TOKEN: "" }),
      fetchImpl: async () => {
        calls += 1;
        return acceptedHubSpot();
      }
    })
  );
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.submission_status, "FAILED");
  assert.equal(body.code, "DELIVERY_CONFIGURATION_ERROR");
  assert.equal(calls, 0);
});

test("HubSpot capture precedes one Resend notification and replays SUCCESS without new calls", async () => {
  const calls = [];
  const idempotencyStore = new Map();
  const rateLimitStore = new Map();
  const store = createMemoryInquiryStateStore({ idempotencyStore, rateLimitStore });
  const fetchImpl = async (url, options) => {
    calls.push({ url: String(url), options });
    if (new URL(url).hostname === HUBSPOT_HOST) return acceptedHubSpot();
    if (String(url) === RESEND_URL) return json({ id: "resend-message-123" });
    throw new Error("Unexpected provider URL");
  };
  const options = harness({ store, fetchImpl });
  const first = await handleInquiryRequest(request(validBody(), key(3)), options);
  const firstBody = await first.json();
  const replay = await handleInquiryRequest(request(validBody(), key(3)), options);
  const replayBody = await replay.json();

  assert.equal(first.status, 200);
  assert.equal(firstBody.submission_status, "SUCCESS");
  assert.equal(firstBody.submission_id, "GL-20261123-87654321");
  assert.match(first.headers.get("set-cookie"), /HttpOnly/);
  assert.equal(replay.status, 200);
  assert.equal(replayBody.idempotency_replayed, true);
  assert.equal(calls.length, 2);
  assert.equal(new URL(calls[0].url).hostname, HUBSPOT_HOST);
  assert.equal(calls[1].url, RESEND_URL);

  const hubSpotBody = JSON.parse(calls[0].options.body);
  const details = hubSpotBody.fields.find(
    (field) => field.name === "gdlogi_inquiry_details"
  ).value;
  assert.match(details, /Destination country: United States/);
  assert.match(details, /Service needs: Shipping, Consolidation, Inspection/);
  assert.match(details, /Product Quality Inspection/);

  const emailBody = JSON.parse(calls[1].options.body);
  assert.equal(emailBody.reply_to, "buyer@example.com");
  assert.deepEqual(emailBody.to, ["zoe@gdlogi.com"]);
  assert.match(emailBody.text, /Destination country: United States/);
  assert.match(emailBody.text, /Product Quality Inspection/);
  assert.equal(
    calls[1].options.headers["Idempotency-Key"],
    "inquiry-notification/GL-20261123-87654321"
  );
  const persistedState = JSON.stringify([...idempotencyStore.values()]);
  assert.doesNotMatch(persistedState, /buyer@example\.com/);
  assert.doesNotMatch(persistedState, /Commercial display samples/);
});

test("HubSpot explicit rejection fails and never calls Resend", async () => {
  let calls = 0;
  const response = await handleInquiryRequest(
    request(validBody(), key(4)),
    harness({
      fetchImpl: async (url) => {
        calls += 1;
        assert.equal(new URL(url).hostname, HUBSPOT_HOST);
        return json({ category: "VALIDATION_ERROR" }, 400);
      }
    })
  );
  const body = await response.json();

  assert.equal(response.status, 502);
  assert.equal(body.submission_status, "FAILED");
  assert.equal(body.code, "HUBSPOT_REJECTED");
  assert.equal(calls, 1);
});

test("HubSpot uncertainty stays PENDING and never calls Resend", async () => {
  let calls = 0;
  const response = await handleInquiryRequest(
    request(validBody(), key(5)),
    harness({
      fetchImpl: async (url) => {
        calls += 1;
        assert.equal(new URL(url).hostname, HUBSPOT_HOST);
        return json({ category: "SERVER_ERROR" }, 503);
      }
    })
  );
  const body = await response.json();

  assert.equal(response.status, 202);
  assert.equal(body.submission_status, "PENDING");
  assert.equal(body.code, "HUBSPOT_RESPONSE_UNKNOWN");
  assert.equal(calls, 1);
});

test("an uncertain CAPTURED write returns PENDING and does not notify", async () => {
  let calls = 0;
  const baseStore = createMemoryInquiryStateStore();
  const store = {
    ...baseStore,
    capture: async () => {
      throw new Error("mock capture failure");
    }
  };
  const response = await handleInquiryRequest(
    request(validBody(), key(6)),
    harness({
      store,
      fetchImpl: async (url) => {
        calls += 1;
        assert.equal(new URL(url).hostname, HUBSPOT_HOST);
        return acceptedHubSpot();
      }
    })
  );
  const body = await response.json();

  assert.equal(response.status, 202);
  assert.equal(body.code, "STATE_STORE_CAPTURE_UNKNOWN");
  assert.equal(calls, 1);
});

test("Resend rejection or uncertainty never changes a captured inquiry from SUCCESS", async () => {
  for (const [notificationResponse, requestKey] of [
    [json({ message: "forbidden" }, 403), key(7)],
    [json({ message: "unavailable" }, 503), key(8)]
  ]) {
    let calls = 0;
    const response = await handleInquiryRequest(
      request(validBody({ product_name: `Cargo ${requestKey.slice(-2)}` }), requestKey),
      harness({
        fetchImpl: async (url) => {
          calls += 1;
          return new URL(url).hostname === HUBSPOT_HOST
            ? acceptedHubSpot()
            : notificationResponse;
        }
      })
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.submission_status, "SUCCESS");
    assert.equal(calls, 2);
  }
});

test("a final write failure after CAPTURED still returns and replays SUCCESS without resending", async () => {
  let calls = 0;
  const idempotencyStore = new Map();
  const rateLimitStore = new Map();
  const baseStore = createMemoryInquiryStateStore({ idempotencyStore, rateLimitStore });
  const firstStore = {
    ...baseStore,
    complete: async () => {
      throw new Error("mock final write failure");
    }
  };
  const fetchImpl = async (url) => {
    calls += 1;
    return new URL(url).hostname === HUBSPOT_HOST
      ? acceptedHubSpot()
      : json({ id: "resend-message-final-write" });
  };
  const requestKey = key(9);
  const first = await handleInquiryRequest(
    request(validBody(), requestKey),
    harness({ store: firstStore, fetchImpl })
  );
  const replay = await handleInquiryRequest(
    request(validBody(), requestKey),
    harness({ store: baseStore, fetchImpl })
  );

  assert.equal(first.status, 200);
  assert.equal((await first.json()).submission_status, "SUCCESS");
  assert.equal(replay.status, 200);
  assert.equal((await replay.json()).idempotency_replayed, true);
  assert.equal(calls, 2);
});

test("two instances and a restarted instance share one dual-provider delivery", async () => {
  let providerCalls = 0;
  let releaseHubSpot;
  const hubSpotGate = new Promise((resolve) => {
    releaseHubSpot = resolve;
  });
  const idempotencyStore = new Map();
  const rateLimitStore = new Map();
  const firstStore = createMemoryInquiryStateStore({ idempotencyStore, rateLimitStore });
  const secondStore = createMemoryInquiryStateStore({ idempotencyStore, rateLimitStore });
  const fetchImpl = async (url) => {
    providerCalls += 1;
    if (new URL(url).hostname === HUBSPOT_HOST) {
      await hubSpotGate;
      return acceptedHubSpot();
    }
    return json({ id: "resend-message-concurrent" });
  };
  const requestKey = key(10);
  const firstPromise = handleInquiryRequest(
    request(validBody(), requestKey),
    harness({ store: firstStore, fetchImpl })
  );
  await new Promise((resolve) => setImmediate(resolve));
  const concurrent = await handleInquiryRequest(
    request(validBody(), requestKey),
    harness({ store: secondStore, fetchImpl })
  );
  assert.equal(concurrent.status, 202);
  assert.equal((await concurrent.json()).code, "SUBMISSION_IN_PROGRESS");
  assert.equal(providerCalls, 1);

  releaseHubSpot();
  const first = await firstPromise;
  assert.equal(first.status, 200);
  assert.equal(providerCalls, 2);

  const restartedStore = createMemoryInquiryStateStore({
    idempotencyStore,
    rateLimitStore
  });
  const replay = await handleInquiryRequest(
    request(validBody(), requestKey),
    harness({ store: restartedStore, fetchImpl })
  );
  assert.equal(replay.status, 200);
  assert.equal((await replay.json()).idempotency_replayed, true);
  assert.equal(providerCalls, 2);
});
