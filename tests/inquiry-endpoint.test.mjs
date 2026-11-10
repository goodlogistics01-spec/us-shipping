import assert from "node:assert/strict";
import test from "node:test";

import {
  handleInquiryRequest,
  resolveProviderConfiguration
} from "../app/lib/inquiry-endpoint.mjs";
import {
  inquiryConfirmationCookieName,
  isConfirmedInquiryRequest,
  normalizeInquiryRequestId
} from "../app/lib/inquiry-confirmation.mjs";

const NOW = new Date("2026-11-10T08:00:00.000Z");
const UUID = "12345678-1234-4123-8123-123456789abc";
const PROVIDER_ENDPOINT = "https://provider.example/mock";

function key(number = 1) {
  return `inq-${number.toString(16).padStart(64, "0")}`;
}

function validBody(overrides = {}) {
  return {
    source_type: "quote-page",
    name: "Route Test",
    company: "Example Buyer",
    email: "route.test@example.com",
    whatsapp: "+1 213 555 0188",
    preferred_contact: "email",
    product_name: "Commercial furniture",
    origin: "Shenzhen",
    destination: "Los Angeles, CA 90001",
    service: "supplier-consolidation",
    shipping_method: "ocean-freight",
    service_needs: ["shipping", "consolidation", "inspection"],
    inspection_types: ["receiving-checks", "product-quality-inspection"],
    privacy_consent: "agreed",
    source_page: "https://gdlogi.us/quote/",
    ...overrides
  };
}

function jsonRequest(body = validBody(), {
  requestKey = key(),
  bodyKey = requestKey,
  url = "https://gdlogi.us/api/inquiry/",
  ip = "203.0.113.10",
  headers = {}
} = {}) {
  const requestHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(ip ? { "x-forwarded-for": ip } : {}),
    ...(requestKey ? { "Idempotency-Key": requestKey } : {}),
    ...headers
  };
  return new Request(url, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({ ...body, ...(bodyKey ? { idempotency_key: bodyKey } : {}) })
  });
}

function harness(overrides = {}) {
  return {
    env: { INQUIRY_PROVIDER_ENDPOINT: PROVIDER_ENDPOINT },
    rateLimitStore: new Map(),
    idempotencyStore: new Map(),
    now: () => NOW,
    uuidFactory: () => UUID,
    ...overrides
  };
}

function jsonProvider(body, { status = 200, contentType = "application/json" } = {}) {
  return new Response(body, { status, headers: { "content-type": contentType } });
}

test("SUCCESS returns a bound request ID cookie and carries every inquiry field to the provider", async () => {
  let providerBody;
  let calls = 0;
  const response = await handleInquiryRequest(
    jsonRequest(),
    harness({
      fetchImpl: async (_url, options) => {
        calls += 1;
        providerBody = JSON.parse(options.body);
        return jsonProvider(JSON.stringify({ success: true }));
      }
    })
  );
  const result = await response.json();

  assert.equal(calls, 1);
  assert.equal(response.status, 200);
  assert.equal(result.ok, true);
  assert.equal(result.submission_status, "SUCCESS");
  assert.equal(result.submission_id, "GL-20261110-12345678");
  assert.equal(result.request_id, result.submission_id);
  assert.equal(result.redirect, "/thank-you/?request_id=GL-20261110-12345678");
  assert.match(
    response.headers.get("set-cookie"),
    /gdlogi_inquiry_accepted_GL-20261110-12345678=GL-20261110-12345678/
  );
  assert.match(response.headers.get("set-cookie"), /HttpOnly/);
  assert.match(response.headers.get("set-cookie"), /SameSite=Lax/);
  assert.match(response.headers.get("set-cookie"), /Max-Age=300/);
  assert.match(response.headers.get("set-cookie"), /Secure/);
  assert.equal(providerBody._replyto, "route.test@example.com");
  assert.equal(providerBody.requested_service, "Supplier Consolidation");
  assert.equal(providerBody.shipping_method, "Ocean freight — review FCL/LCL");
  assert.equal(providerBody.service_needs, "Shipping, Consolidation, Inspection");
  assert.match(providerBody.inspection_types, /Receiving Checks/);
  assert.match(providerBody.inspection_types, /Product Quality Inspection/);
});

test("URL-encoded requests preserve repeated service and inspection fields and redirect with the same ID", async () => {
  const form = new URLSearchParams();
  const body = validBody();
  for (const [name, value] of Object.entries(body)) {
    if (Array.isArray(value)) value.forEach((item) => form.append(name, item));
    else form.set(name, value);
  }
  form.set("idempotency_key", key(2));
  let providerBody;
  const response = await handleInquiryRequest(
    new Request("https://gdlogi.us/api/inquiry/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-forwarded-for": "203.0.113.11"
      },
      body: form.toString()
    }),
    harness({
      fetchImpl: async (_url, options) => {
        providerBody = JSON.parse(options.body);
        return jsonProvider(JSON.stringify({ accepted: true }));
      }
    })
  );

  assert.equal(response.status, 303);
  assert.equal(
    response.headers.get("location"),
    "https://gdlogi.us/thank-you/?request_id=GL-20261110-12345678"
  );
  assert.match(providerBody.service_needs, /Shipping, Consolidation, Inspection/);
  assert.match(providerBody.inspection_types, /Receiving Checks/);
  assert.match(providerBody.inspection_types, /Product Quality Inspection/);
});

test("explicit provider rejection is FAILED, has no success cookie, and corrected cargo can retry", async () => {
  let calls = 0;
  const options = harness({
    fetchImpl: async (_url, fetchOptions) => {
      calls += 1;
      const providerBody = JSON.parse(fetchOptions.body);
      return providerBody.product_name === "Corrected furniture"
        ? jsonProvider(JSON.stringify({ success: true }))
        : jsonProvider(JSON.stringify({ success: false }), { status: 400 });
    }
  });
  const failed = await handleInquiryRequest(jsonRequest(validBody(), { requestKey: key(3) }), options);
  const failedResult = await failed.json();
  const corrected = await handleInquiryRequest(
    jsonRequest(validBody({ product_name: "Corrected furniture" }), { requestKey: key(4) }),
    options
  );

  assert.equal(failed.status, 502);
  assert.equal(failedResult.submission_status, "FAILED");
  assert.equal(failed.headers.get("set-cookie"), null);
  assert.equal(corrected.status, 200);
  assert.equal(calls, 2);
});

test("202 stays PENDING and an identical replay never resends", async () => {
  let calls = 0;
  const options = harness({
    fetchImpl: async () => {
      calls += 1;
      return jsonProvider(JSON.stringify({ accepted: true }), { status: 202 });
    }
  });
  const first = await handleInquiryRequest(jsonRequest(validBody(), { requestKey: key(5) }), options);
  const replay = await handleInquiryRequest(jsonRequest(validBody(), { requestKey: key(5) }), options);
  const firstResult = await first.json();
  const replayResult = await replay.json();

  assert.equal(first.status, 202);
  assert.equal(firstResult.submission_status, "PENDING");
  assert.equal(first.headers.get("set-cookie"), null);
  assert.equal(replay.status, 202);
  assert.equal(replayResult.idempotency_replayed, true);
  assert.equal(replay.headers.get("idempotency-replayed"), "true");
  assert.equal(calls, 1);
});

test("concurrent requests with the same key and payload share one provider call", async () => {
  let calls = 0;
  let releaseProvider;
  const providerPromise = new Promise((resolve) => {
    releaseProvider = resolve;
  });
  const options = harness({
    fetchImpl: async () => {
      calls += 1;
      await providerPromise;
      return jsonProvider(JSON.stringify({ success: true }));
    }
  });
  const firstPromise = handleInquiryRequest(
    jsonRequest(validBody(), { requestKey: key(6) }),
    options
  );
  const secondPromise = handleInquiryRequest(
    jsonRequest(validBody(), { requestKey: key(6) }),
    options
  );
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls, 1);
  releaseProvider();
  const [first, second] = await Promise.all([firstPromise, secondPromise]);
  const firstResult = await first.json();
  const secondResult = await second.json();

  assert.equal(firstResult.request_id, secondResult.request_id);
  assert.equal(second.headers.get("idempotency-replayed"), "true");
  assert.equal(calls, 1);
});

test("the same idempotency key cannot be reused for different cargo", async () => {
  let calls = 0;
  const options = harness({
    fetchImpl: async () => {
      calls += 1;
      return jsonProvider(JSON.stringify({ success: true }));
    }
  });
  await handleInquiryRequest(jsonRequest(validBody(), { requestKey: key(7) }), options);
  const conflict = await handleInquiryRequest(
    jsonRequest(validBody({ product_name: "Different cargo" }), { requestKey: key(7) }),
    options
  );
  const result = await conflict.json();

  assert.equal(conflict.status, 409);
  assert.equal(result.code, "IDEMPOTENCY_CONFLICT");
  assert.equal(calls, 1);
});

test("mismatched or malformed idempotency keys are rejected before provider delivery", async () => {
  let calls = 0;
  const options = harness({
    fetchImpl: async () => {
      calls += 1;
      return jsonProvider(JSON.stringify({ success: true }));
    }
  });
  const mismatch = await handleInquiryRequest(
    jsonRequest(validBody(), { requestKey: key(8), bodyKey: key(9) }),
    options
  );
  const malformed = await handleInquiryRequest(
    jsonRequest(validBody(), { requestKey: "bad-key" }),
    options
  );

  assert.equal(mismatch.status, 400);
  assert.equal((await mismatch.json()).code, "IDEMPOTENCY_KEY_MISMATCH");
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).code, "INVALID_IDEMPOTENCY_KEY");
  assert.equal(calls, 0);
});

test("honeypot is filtered before rate limiting, idempotency, or provider calls", async () => {
  let calls = 0;
  const options = harness({
    fetchImpl: async () => {
      calls += 1;
      return jsonProvider(JSON.stringify({ success: true }));
    }
  });
  const response = await handleInquiryRequest(
    jsonRequest(validBody({ _honey: "spam" }), { requestKey: key(10) }),
    options
  );

  assert.equal(response.status, 200);
  assert.equal((await response.json()).submission_status, "FILTERED");
  assert.equal(calls, 0);
  assert.equal(options.rateLimitStore.size, 0);
  assert.equal(options.idempotencyStore.size, 0);
});

test("rate limiting allows five distinct cargo requests, returns Retry-After on the sixth, and does not pool missing IPs", async () => {
  let calls = 0;
  const options = harness({
    fetchImpl: async () => {
      calls += 1;
      return jsonProvider(JSON.stringify({ success: true }));
    }
  });
  for (let index = 1; index <= 5; index += 1) {
    const response = await handleInquiryRequest(
      jsonRequest(validBody({ product_name: `Cargo ${index}` }), { requestKey: key(20 + index) }),
      options
    );
    assert.equal(response.status, 200);
  }
  const limited = await handleInquiryRequest(
    jsonRequest(validBody({ product_name: "Cargo 6" }), { requestKey: key(26) }),
    options
  );
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("retry-after")) > 0);
  assert.equal(calls, 5);

  const noIpOptions = harness({
    fetchImpl: async () => {
      calls += 1;
      return jsonProvider(JSON.stringify({ success: true }));
    }
  });
  for (let index = 1; index <= 6; index += 1) {
    const response = await handleInquiryRequest(
      jsonRequest(validBody({ product_name: `No-IP cargo ${index}` }), {
        requestKey: key(30 + index),
        ip: ""
      }),
      noIpOptions
    );
    assert.equal(response.status, 200);
  }
  assert.equal(noIpOptions.rateLimitStore.has("unknown"), false);
  assert.equal(noIpOptions.rateLimitStore.size, 0);
});

test("different cargo with the same email and IP is not treated as an idempotent replay", async () => {
  let calls = 0;
  const options = harness({
    fetchImpl: async () => {
      calls += 1;
      return jsonProvider(JSON.stringify({ success: true }));
    }
  });
  const first = await handleInquiryRequest(
    jsonRequest(validBody({ product_name: "Cargo A" }), { requestKey: key(40) }),
    options
  );
  const second = await handleInquiryRequest(
    jsonRequest(validBody({ product_name: "Cargo B" }), { requestKey: key(41) }),
    options
  );

  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.equal(calls, 2);
});

test("unsafe provider configuration fails clearly without a fetch call", async () => {
  for (const endpoint of [
    "not a URL",
    "https://provider.invalid/mock",
    "http://provider.example/mock",
    "https://192.168.1.10/mock",
    "http://127.0.0.1:3199/mock"
  ]) {
    let calls = 0;
    const response = await handleInquiryRequest(
      jsonRequest(validBody(), { requestKey: key(50 + calls) }),
      harness({
        env: { INQUIRY_PROVIDER_ENDPOINT: endpoint },
        fetchImpl: async () => {
          calls += 1;
          return jsonProvider(JSON.stringify({ success: true }));
        }
      })
    );
    const result = await response.json();
    assert.equal(response.status, 503, endpoint);
    assert.equal(result.code, "PROVIDER_CONFIGURATION_ERROR", endpoint);
    assert.equal(response.headers.get("set-cookie"), null, endpoint);
    assert.equal(calls, 0, endpoint);
  }
});

test("local mock requires explicit QA mode, loopback request host, and the local-only switch", () => {
  const localEnv = {
    INQUIRY_PROVIDER_MODE: "local-mock",
    INQUIRY_PROVIDER_ENDPOINT: "http://127.0.0.1:3199/mock",
    INQUIRY_ALLOW_LOCAL_MOCK: "true"
  };
  assert.equal(
    resolveProviderConfiguration(
      new Request("http://127.0.0.1:3100/api/inquiry/"),
      localEnv
    ).ok,
    true
  );
  assert.equal(
    resolveProviderConfiguration(
      new Request("https://gdlogi.us/api/inquiry/"),
      localEnv
    ).ok,
    false
  );
  assert.equal(
    resolveProviderConfiguration(
      new Request("http://127.0.0.1:3100/api/inquiry/"),
      { ...localEnv, INQUIRY_ALLOW_LOCAL_MOCK: "false" }
    ).ok,
    false
  );
  assert.equal(
    resolveProviderConfiguration(
      new Request("http://[::1]:3100/api/inquiry/"),
      {
        ...localEnv,
        INQUIRY_PROVIDER_ENDPOINT: "http://[::1]:3199/mock"
      }
    ).ok,
    true
  );
});

test("a local site request cannot contact the real provider unless separately and explicitly allowed", () => {
  assert.equal(
    resolveProviderConfiguration(
      new Request("http://127.0.0.1:3100/api/inquiry/"),
      {}
    ).ok,
    false
  );
  assert.equal(
    resolveProviderConfiguration(
      new Request("http://127.0.0.1:3100/api/inquiry/"),
      { INQUIRY_ALLOW_REAL_PROVIDER_LOCAL: "true" }
    ).ok,
    true
  );
});

test("thank-you confirmation requires a valid request ID and its matching short-lived cookie", () => {
  const requestId = "GL-20261110-12345678";
  assert.equal(normalizeInquiryRequestId(requestId), requestId);
  assert.equal(normalizeInquiryRequestId("GL-unsafe"), "");
  assert.equal(
    inquiryConfirmationCookieName(requestId),
    "gdlogi_inquiry_accepted_GL-20261110-12345678"
  );
  assert.equal(isConfirmedInquiryRequest(requestId, requestId), true);
  assert.equal(isConfirmedInquiryRequest(requestId, "GL-20261110-87654321"), false);
});
