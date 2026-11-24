import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const quoteForm = await readFile(
  new URL("app/components/QuoteForm.js", projectRoot),
  "utf8"
);
const homepage = await readFile(
  new URL("content/good-logistics-homepage-v2.html", projectRoot),
  "utf8"
);
const homeInteractions = await readFile(
  new URL("app/HomeInteractions.js", projectRoot),
  "utf8"
);

test("quote form keeps the full field contract while defaulting to Shipping", () => {
  assert.match(quoteForm, /defaultServiceNeeds = \["shipping"\]/);
  for (const value of [
    "shipping",
    "supplier-pickup",
    "consolidation",
    "warehousing",
    "fba-prep-labeling",
    "repacking",
    "kitting-light-assembly",
    "inspection",
    "not-sure"
  ]) {
    assert.match(quoteForm, new RegExp(`\\["${value}",`));
  }
  assert.match(quoteForm, /name="service_needs"/);
  assert.match(quoteForm, /name="inspection_types"/);
});

test("quote form collapses extra services and shipment measurements", () => {
  assert.match(quoteForm, /ref=\{serviceOptionsRef\}/);
  assert.match(quoteForm, /Add pickup, prep or inspection/);
  assert.match(quoteForm, /selectedAdditionalServiceCount/);
  assert.match(
    quoteForm,
    /serviceOptionsRef\.current\?\.setAttribute\("open", ""\)/
  );

  const optionalStart = quoteForm.indexOf(
    '<details className="marketing-optional-details form-span-two" ref={optionalDetailsRef}>'
  );
  const optionalEnd = quoteForm.indexOf("</details>", optionalStart);
  assert.ok(optionalStart >= 0 && optionalEnd > optionalStart);
  for (const field of ['name="weight"', 'name="volume"']) {
    const index = quoteForm.indexOf(field);
    assert.ok(index > optionalStart && index < optionalEnd, `${field} must stay optional`);
  }
});

test("quote form only asks for a phone number when the reply method needs it", () => {
  assert.match(quoteForm, /hidden=\{preferredContact === "email"\}/);
  assert.match(quoteForm, /disabled=\{preferredContact === "email"\}/);
  assert.match(quoteForm, /aria-controls="quote-whatsapp-field"/);
  assert.match(quoteForm, /required=\{preferredContact === "whatsapp"\}/);
  assert.match(quoteForm, /Only starred fields are required\. We can confirm the remaining details with you\./);
});

test("homepage quick quote uses the same reduced default without losing fields", () => {
  assert.match(
    homepage,
    /name="service_needs" value="shipping"[^>]*checked/
  );
  assert.match(homepage, /data-home-phone-field hidden/);
  assert.match(homeInteractions, /phoneField\.hidden = !phoneIsVisible/);
  assert.match(homeInteractions, /phone\.disabled = !phoneIsVisible/);
  assert.doesNotMatch(homeInteractions, /phone\.value = ""/);
  assert.match(homeInteractions, /onPageShow = \(\) => \{\s+validatePhone\(\)/);

  const optionalStart = homepage.indexOf(
    '<details class="home-optional-details home-form-full" data-home-optional-details>'
  );
  const optionalEnd = homepage.indexOf("</details>", optionalStart);
  assert.ok(optionalStart >= 0 && optionalEnd > optionalStart);
  for (const field of ['name="weight"', 'name="volume"', 'name="company"']) {
    const index = homepage.indexOf(field);
    assert.ok(index > optionalStart && index < optionalEnd, `${field} must stay optional`);
  }
});

test("failed form states retain a customer-safe submission reference", () => {
  assert.match(quoteForm, /Reference: \{submissionId\}/);
  assert.match(homeInteractions, /Reference: \$\{error\.submissionId\}/);
});
