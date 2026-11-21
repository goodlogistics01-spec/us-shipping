import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const homepage = await readFile(new URL("content/good-logistics-homepage-v2.html", projectRoot), "utf8");
const analyticsBridge = await readFile(new URL("app/components/AnalyticsBridge.js", projectRoot), "utf8");
const oceanFreightPage = await readFile(new URL("app/components/OceanFreightPage.js", projectRoot), "utf8");

function hrefFor(label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = homepage.match(new RegExp(`<a[^>]+href="([^"]+)"[^>]*>${escaped}</a>`));
  assert.ok(match, `Missing homepage link: ${label}`);
  return new URL(match[1].replaceAll("&amp;", "&"), "https://gdlogi.us");
}

test("homepage customer scenarios use the three approved buyer-oriented messages", () => {
  assert.match(homepage, /Several Suppliers\. One Shipment Plan\./);
  assert.match(homepage, /Prepare Your Stock for U\.S\. Delivery\./);
  assert.match(homepage, /A Shipping Plan Built Around Your Cargo\./);
  assert.match(homepage, /Start with the cargo problem you need to solve/);
});

test("homepage moves core freight modes directly after customer scenarios and omits weak delivery proof", () => {
  const scenarios = homepage.indexOf('id="customer-paths"');
  const modes = homepage.indexOf('id="services"');
  const operations = homepage.indexOf('id="home-operations-showcase-title"');
  assert.ok(scenarios >= 0 && modes > scenarios && operations > modes);
  assert.doesNotMatch(homepage, /redacted-delivery-record|home-delivery-proof|privacy-treated/);
});

test("multi-supplier scenario opens the editable quote contract with the right service preselection", () => {
  const url = hrefFor("Plan My Consolidated Shipment");
  assert.equal(url.pathname, "/quote/");
  assert.equal(url.searchParams.get("shipping_method"), "not-sure");
  assert.deepEqual(url.searchParams.getAll("service_need"), [
    "shipping",
    "supplier-pickup",
    "consolidation"
  ]);
});

test("FBA scenario opens the quote contract without inventing a new service value", () => {
  const url = hrefFor("Discuss My FBA Shipment");
  assert.equal(url.pathname, "/quote/");
  assert.equal(url.searchParams.get("shipping_method"), "not-sure");
  assert.deepEqual(url.searchParams.getAll("service_need"), [
    "shipping",
    "fba-prep-labeling",
    "repacking"
  ]);
});

test("complex-cargo scenario keeps the service choice conservative and editable", () => {
  const url = hrefFor("Review My Shipping Options");
  assert.equal(url.pathname, "/quote/");
  assert.equal(url.searchParams.get("shipping_method"), "not-sure");
  assert.deepEqual(url.searchParams.getAll("service_need"), ["shipping"]);
});

test("scenario CTA attribution is allowlisted rather than copied from a URL or label", () => {
  for (const location of [
    "customer_scenario_consolidation",
    "customer_scenario_fba",
    "customer_scenario_complex_cargo"
  ]) {
    assert.match(homepage, new RegExp(`data-quote-location="${location}"`));
    assert.match(analyticsBridge, new RegExp(`"${location}"`));
  }
  assert.match(analyticsBridge, /QUOTE_LINK_LOCATIONS\.has\(requestedLocation\)/);
  assert.doesNotMatch(analyticsBridge, /searchParams.*link_location/);
});

test("public homepage omits rejected scale, credential and case-study claims", () => {
  assert.doesNotMatch(homepage, /\b(?:NVOCC|AQL|190,?000|30,?000\s*(?:m²|square meters)|10\+\s*years)\b/i);
  assert.doesNotMatch(homepage, /Chicago case study|999,?996|140\+\s*(?:employees|staff)/i);
});

test("sea-freight in-page quote CTA has allowlisted anonymous attribution", () => {
  const location = "ocean_hero";
  assert.match(oceanFreightPage, new RegExp(`href="#quote-form" data-quote-location="${location}"`));
  assert.match(analyticsBridge, new RegExp(`"${location}"`));
  assert.doesNotMatch(oceanFreightPage, /Typical Transit Planning|ocean_schedule/);
  assert.doesNotMatch(analyticsBridge, /ocean_schedule/);
  assert.match(analyticsBridge, /url\.hash === "#quote-form"/);
});
