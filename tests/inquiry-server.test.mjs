import assert from "node:assert/strict";
import test from "node:test";

import {
  buildProviderPayload,
  isValidEmail,
  isValidPhone,
  normalizePayload,
  submitToProvider,
  validatePayload
} from "../app/lib/inquiry-server.mjs";

const requestStub = {
  headers: new Headers({ referer: "https://gdlogi.us/quote/?email=private@example.com" })
};

function validRaw(overrides = {}) {
  return {
    source_type: "quote-page",
    name: "Audit User",
    email: "audit@example.com",
    whatsapp: "+1 213 555 0188",
    preferred_contact: "email",
    product_name: "Commercial furniture",
    origin: "Shenzhen",
    destination: "Los Angeles, CA 90001",
    service: "not-sure",
    shipping_method: "not-sure",
    service_needs: ["not-sure"],
    privacy_consent: "agreed",
    ...overrides
  };
}

function validPayload(overrides = {}) {
  return normalizePayload(validRaw(overrides), requestStub);
}

function response(body, { status = 200, contentType = "application/json" } = {}) {
  return new Response(body, { status, headers: { "content-type": contentType } });
}

test("email validation accepts ordinary and tagged international-domain forms", () => {
  assert.equal(isValidEmail("audit@example.com"), true);
  assert.equal(isValidEmail("name+tag@example.co.uk"), true);
  assert.equal(isValidEmail("invalid-email"), false);
  assert.equal(isValidEmail("name@example"), false);
  assert.equal(isValidEmail("name..dots@example.com"), false);
});

test("phone validation accepts common international punctuation without claiming WhatsApp registration", () => {
  assert.equal(isValidPhone("+1 213 555 0188"), true);
  assert.equal(isValidPhone("+44 (0)20 7946-0958"), true);
  assert.equal(isValidPhone("12345"), false);
  assert.equal(isValidPhone("+1 CALL-NOW"), false);
});

test("normalization removes arbitrary URL queries and limits attribution characters", () => {
  const payload = normalizePayload(
    validRaw({
      source_page: "https://gdlogi.us/quote/?email=private@example.com&utm_source=google#form",
      referrer: "https://example.com/path?user=private@example.com",
      utm_source: "google<script>",
      utm_medium: "paid search",
      utm_campaign: "china-to-usa_2026"
    }),
    requestStub
  );

  assert.equal(payload.source_page, "https://gdlogi.us/quote/");
  assert.equal(payload.referrer, "https://example.com");
  assert.equal(payload.utm_source, "googlescript");
  assert.equal(payload.utm_medium, "paid search");
  assert.equal(payload.utm_campaign, "china-to-usa_2026");

  const piiAttribution = normalizePayload(
    validRaw({ utm_campaign: "private@example.com", utm_source: "https://example.com/path" }),
    requestStub
  );
  assert.equal(piiAttribution.utm_campaign, "");
  assert.equal(piiAttribution.utm_source, "");
});

test("legacy phone and requirement names normalize into the current schema", () => {
  const raw = validRaw();
  delete raw.whatsapp;
  delete raw.product_name;
  raw.phone = "+1 213 555 0188";
  raw.requirement = "Industrial pumps";

  const payload = normalizePayload(raw, requestStub);
  assert.equal(payload.whatsapp, "+1 213 555 0188");
  assert.equal(payload.product_name, "Industrial pumps");
  assert.deepEqual(validatePayload(payload), {});
});

test("email reply permits an empty phone, WhatsApp reply requires one", () => {
  const emailPayload = validPayload({ whatsapp: "", preferred_contact: "email" });
  assert.deepEqual(validatePayload(emailPayload), {});

  const whatsappPayload = validPayload({ whatsapp: "", preferred_contact: "whatsapp" });
  assert.equal(
    validatePayload(whatsappPayload).whatsapp,
    "Phone or WhatsApp is required for WhatsApp replies."
  );
});

test("an optional phone is still validated when provided", () => {
  const payload = validPayload({ whatsapp: "+1 invalid", preferred_contact: "email" });
  assert.equal(validatePayload(payload).whatsapp, "Enter a valid phone or WhatsApp number.");
});

test("product name is required across public inquiry entry points", () => {
  for (const source_type of [
    "homepage-quick-quote",
    "quote-page",
    "service-page",
    "article-popup"
  ]) {
    const payload = validPayload({ source_type, product_name: "" });
    assert.equal(
      validatePayload(payload).product_name,
      "Product name or description is required.",
      source_type
    );
  }
});

test("name is required consistently across public inquiry entry points", () => {
  for (const source_type of [
    "homepage-quick-quote",
    "quote-page",
    "service-page",
    "article-popup"
  ]) {
    const payload = validPayload({ source_type, name: "" });
    assert.equal(validatePayload(payload).name, "Name is required.", source_type);
  }
});

test("unknown or empty service defaults to recommendation instead of air freight", () => {
  assert.equal(validPayload({ service: "" }).service, "not-sure");
  assert.equal(validPayload({ service: "untrusted-value" }).service, "not-sure");
});

test("shipping method stays separate from multi-value service needs", () => {
  const payload = validPayload({
    service: "",
    shipping_method: "ocean-freight",
    service_needs: ["shipping", "fba-prep-labeling", "kitting-light-assembly"]
  });

  assert.equal(payload.shipping_method, "ocean-freight");
  assert.deepEqual(payload.service_needs, [
    "shipping",
    "fba-prep-labeling",
    "kitting-light-assembly"
  ]);
  assert.deepEqual(validatePayload(payload), {});
});

test("legacy service values populate safe shipping and operation defaults", () => {
  const amazonPayload = validPayload({
    shipping_method: "",
    service_needs: [],
    service: "amazon-fba"
  });
  assert.equal(amazonPayload.shipping_method, "not-sure");
  assert.deepEqual(amazonPayload.service_needs, ["shipping", "fba-prep-labeling"]);

  const seaPayload = validPayload({
    shipping_method: "",
    service_needs: [],
    service: "sea-freight"
  });
  assert.equal(seaPayload.shipping_method, "ocean-freight");
  assert.deepEqual(seaPayload.service_needs, ["shipping"]);
});

test("service needs are allowlisted, deduplicated, and remove not-sure when concrete needs exist", () => {
  const payload = validPayload({
    service_needs: [
      "not-sure",
      "supplier-pickup",
      "supplier-pickup",
      "repacking",
      "<script>"
    ]
  });
  assert.deepEqual(payload.service_needs, ["supplier-pickup", "repacking"]);
});

test("receiving checks and product-quality inspection remain separate and may be selected together", () => {
  const payload = validPayload({
    service_needs: ["inspection"],
    inspection_types: ["receiving-checks", "product-quality-inspection"]
  });

  assert.deepEqual(payload.service_needs, ["inspection"]);
  assert.deepEqual(payload.inspection_types, [
    "receiving-checks",
    "product-quality-inspection"
  ]);
});

test("legacy generic inspection stays unspecified and is never promoted to product inspection", () => {
  const payload = validPayload({
    service_needs: ["inspection"],
    inspection_types: []
  });
  const legacyTypePayload = validPayload({
    service_needs: ["inspection"],
    inspection_type: "inspection"
  });

  assert.deepEqual(payload.inspection_types, ["scope-not-specified"]);
  assert.deepEqual(legacyTypePayload.inspection_types, ["scope-not-specified"]);
});

test("an explicit inspection type also adds the inspection service category", () => {
  const payload = validPayload({
    service_needs: ["not-sure"],
    inspection_types: ["receiving-checks"]
  });

  assert.deepEqual(payload.service_needs, ["inspection"]);
  assert.deepEqual(payload.inspection_types, ["receiving-checks"]);
});

test("provider payload contains product, shipping method, and every selected service need", () => {
  const payload = validPayload({
    email: "Name+Tag@Example.CO.UK",
    whatsapp: "+1   213  555 0188",
    product_name: "Dining chairs",
    shipping_method: "ocean-freight",
    service_needs: ["shipping", "fba-prep-labeling", "kitting-light-assembly"]
  });
  const providerPayload = buildProviderPayload(payload, "GL-TEST-001");

  assert.equal(providerPayload.product_name, "Dining chairs");
  assert.equal(providerPayload.email, "name+tag@example.co.uk");
  assert.equal(providerPayload.whatsapp, "+1 213 555 0188");
  assert.equal(providerPayload.shipping_method, "Ocean freight — review FCL/LCL");
  assert.equal(
    providerPayload.service_needs,
    "Shipping, FBA Prep / Labeling, Kitting / Light Assembly"
  );
  assert.equal(providerPayload.service, providerPayload.service_needs);
  assert.equal(providerPayload.requested_service, "Not sure — please recommend");
  assert.match(providerPayload._subject, /Shipping \+ FBA Prep \/ Labeling \+1/);
});

test("provider body carries both inspection types and their truthful scope boundaries", () => {
  const payload = validPayload({
    service: "supplier-consolidation",
    service_needs: ["consolidation", "inspection"],
    inspection_types: ["receiving-checks", "product-quality-inspection"]
  });
  const providerPayload = buildProviderPayload(payload, "GL-TEST-INSPECTION");

  assert.equal(providerPayload.requested_service, "Supplier Consolidation");
  assert.equal(
    providerPayload.inspection_types,
    "Receiving Checks — quantity, cartons, labels and visible damage, Product Quality Inspection — scope to confirm"
  );
  assert.match(providerPayload.inspection_scope, /quantity, outer-carton, label and visible-damage/);
  assert.match(providerPayload.inspection_scope, /sampling, criteria and reporting must be confirmed/);
});

test("explicit JSON acceptance is SUCCESS", async () => {
  let sentBody;
  const outcome = await submitToProvider({
    endpoint: "https://provider.invalid/mock",
    payload: validPayload(),
    submissionId: "GL-TEST-SUCCESS",
    timeoutMs: 100,
    fetchImpl: async (_url, options) => {
      sentBody = JSON.parse(options.body);
      return response(JSON.stringify({ success: "true", message: "accepted" }));
    }
  });

  assert.deepEqual(outcome, {
    submissionStatus: "SUCCESS",
    code: "PROVIDER_ACCEPTED"
  });
  assert.equal(sentBody.product_name, "Commercial furniture");
  assert.equal(sentBody.shipping_method, "Not sure — please advise");
  assert.equal(sentBody.service_needs, "Not sure — please advise");
});

test("explicit JSON rejection is FAILED", async () => {
  const outcome = await submitToProvider({
    endpoint: "https://provider.invalid/mock",
    payload: validPayload(),
    submissionId: "GL-TEST-REJECT",
    timeoutMs: 100,
    fetchImpl: async () => response(JSON.stringify({ success: false }), { status: 400 })
  });

  assert.deepEqual(outcome, {
    submissionStatus: "FAILED",
    code: "PROVIDER_REJECTED"
  });
});

test("provider activation requirement is FAILED", async () => {
  const outcome = await submitToProvider({
    endpoint: "https://provider.invalid/mock",
    payload: validPayload(),
    submissionId: "GL-TEST-ACTIVATE",
    timeoutMs: 100,
    fetchImpl: async () =>
      response(JSON.stringify({ success: false, message: "Please activate your email" }))
  });

  assert.deepEqual(outcome, {
    submissionStatus: "FAILED",
    code: "ACTIVATION_REQUIRED"
  });
});

test("provider timeout is PENDING and is not retried", async () => {
  let calls = 0;
  const outcome = await submitToProvider({
    endpoint: "https://provider.invalid/mock",
    payload: validPayload(),
    submissionId: "GL-TEST-TIMEOUT",
    timeoutMs: 15,
    fetchImpl: async (_url, options) => {
      calls += 1;
      return new Promise((_resolve, reject) => {
        options.signal.addEventListener("abort", () => reject(options.signal.reason), { once: true });
      });
    }
  });

  assert.deepEqual(outcome, {
    submissionStatus: "PENDING",
    code: "PROVIDER_TIMEOUT"
  });
  assert.equal(calls, 1);
});

test("provider network error is PENDING and is not retried", async () => {
  let calls = 0;
  const outcome = await submitToProvider({
    endpoint: "https://provider.invalid/mock",
    payload: validPayload(),
    submissionId: "GL-TEST-NETWORK",
    timeoutMs: 100,
    fetchImpl: async () => {
      calls += 1;
      throw new TypeError("mock network unavailable");
    }
  });

  assert.deepEqual(outcome, {
    submissionStatus: "PENDING",
    code: "PROVIDER_NETWORK_ERROR"
  });
  assert.equal(calls, 1);
});

test("non-JSON responses are PENDING regardless of HTTP status", async () => {
  for (const status of [200, 400, 500]) {
    const outcome = await submitToProvider({
      endpoint: "https://provider.invalid/mock",
      payload: validPayload(),
      submissionId: `GL-TEST-NONJSON-${status}`,
      timeoutMs: 100,
      fetchImpl: async () => response("provider html", { status, contentType: "text/html" })
    });

    assert.deepEqual(
      outcome,
      { submissionStatus: "PENDING", code: "PROVIDER_RESPONSE_UNKNOWN" },
      String(status)
    );
  }

  const jsonShapedHtml = await submitToProvider({
    endpoint: "https://provider.invalid/mock",
    payload: validPayload(),
    submissionId: "GL-TEST-NONJSON-SHAPED",
    timeoutMs: 100,
    fetchImpl: async () =>
      response(JSON.stringify({ success: true }), { status: 200, contentType: "text/html" })
  });
  assert.deepEqual(jsonShapedHtml, {
    submissionStatus: "PENDING",
    code: "PROVIDER_RESPONSE_UNKNOWN"
  });
});

test("HTTP 202 remains PENDING even when its JSON body says success", async () => {
  const outcome = await submitToProvider({
    endpoint: "https://provider.invalid/mock",
    payload: validPayload(),
    submissionId: "GL-TEST-202",
    timeoutMs: 100,
    fetchImpl: async () => response(JSON.stringify({ success: true }), { status: 202 })
  });

  assert.deepEqual(outcome, {
    submissionStatus: "PENDING",
    code: "PROVIDER_ACCEPTED_PENDING"
  });
});

test("ambiguous JSON or a non-OK response cannot be promoted to SUCCESS", async () => {
  const unknown = await submitToProvider({
    endpoint: "https://provider.invalid/mock",
    payload: validPayload(),
    submissionId: "GL-TEST-UNKNOWN",
    timeoutMs: 100,
    fetchImpl: async () => response(JSON.stringify({ message: "received" }))
  });
  const nonOk = await submitToProvider({
    endpoint: "https://provider.invalid/mock",
    payload: validPayload(),
    submissionId: "GL-TEST-NONOK",
    timeoutMs: 100,
    fetchImpl: async () => response(JSON.stringify({ success: true }), { status: 500 })
  });

  assert.deepEqual(unknown, {
    submissionStatus: "PENDING",
    code: "PROVIDER_RESPONSE_UNKNOWN"
  });
  assert.deepEqual(nonOk, {
    submissionStatus: "PENDING",
    code: "PROVIDER_RESPONSE_UNKNOWN"
  });
});
