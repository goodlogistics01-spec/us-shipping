"use client";

import { useEffect, useRef, useState } from "react";
import {
  getPublicSourcePage,
  INQUIRY_FAILURE_MESSAGE,
  INQUIRY_PENDING_MESSAGE,
  submitInquiryForm
} from "../lib/inquiry-client";

const shippingMethodOptions = [
  ["not-sure", "Not sure — please advise"],
  ["ocean-freight", "Ocean Freight — review FCL/LCL"],
  ["ocean-fcl", "Ocean FCL"],
  ["ocean-lcl", "Ocean LCL"],
  ["air-freight", "Air Freight"],
  ["express", "Express / Courier"]
];

const serviceNeedOptions = [
  ["shipping", "Shipping"],
  ["supplier-pickup", "Supplier Pickup"],
  ["consolidation", "Consolidation"],
  ["warehousing", "Warehousing"],
  ["fba-prep-labeling", "FBA Prep / Labeling"],
  ["repacking", "Repacking"],
  ["kitting-light-assembly", "Kitting / Light Assembly"],
  ["inspection", "Inspection / Receiving Checks"],
  ["not-sure", "Not sure — please advise"]
];

const inspectionTypeOptions = [
  ["receiving-checks", "Receiving Checks — quantity, cartons, labels and visible damage"],
  ["product-quality-inspection", "Product Quality Inspection — scope to confirm"],
  ["scope-not-specified", "Not sure — help define the inspection scope"]
];

const optionalDetailFieldNames = new Set([
  "company",
  "whatsapp",
  "cargo_ready_date",
  "preferred_contact",
  "package_count",
  "dimensions",
  "cargo_type",
  "message"
]);

const shippingMethodParameterMap = {
  "not-sure": "not-sure",
  "sea-freight": "ocean-freight",
  "sea-freight-china-to-usa": "ocean-freight",
  "ocean-freight": "ocean-freight",
  "ocean-fcl": "ocean-fcl",
  "ocean-lcl": "ocean-lcl",
  fcl: "ocean-fcl",
  lcl: "ocean-lcl",
  "air-freight": "air-freight",
  "air-freight-china-to-usa": "air-freight",
  express: "express",
  "express-shipping": "express"
};

const serviceNeedParameterMap = {
  "not-sure": ["not-sure"],
  shipping: ["shipping"],
  ddp: ["shipping"],
  "ddp-shipping-china-to-usa": ["shipping"],
  "ddp-door-to-door": ["shipping"],
  "amazon-fba": ["shipping", "fba-prep-labeling"],
  "amazon-fba-shipping": ["shipping", "fba-prep-labeling"],
  "fba-prep-labeling": ["fba-prep-labeling"],
  "supplier-consolidation": ["supplier-pickup", "consolidation"],
  "supplier-pickup": ["supplier-pickup"],
  "china-pickup": ["supplier-pickup"],
  consolidation: ["consolidation"],
  warehousing: ["warehousing"],
  "warehousing-inventory-coordination": ["warehousing"],
  repacking: ["repacking"],
  "kitting-light-assembly": ["kitting-light-assembly"],
  inspection: ["inspection"],
  "receiving-checks": ["inspection"],
  "product-quality-inspection": ["inspection"],
  "cargo-inspection-receiving-checks": ["inspection"],
  "customs-clearance": ["shipping"],
  "final-delivery": ["shipping"],
  oversized: ["shipping"],
  "oversized-cargo": ["shipping"],
  "oversized-cargo-shipping": ["shipping"],
  "sea-freight": ["shipping"],
  "sea-freight-china-to-usa": ["shipping"],
  "ocean-freight": ["shipping"],
  "air-freight": ["shipping"],
  "air-freight-china-to-usa": ["shipping"],
  express: ["shipping"],
  "express-shipping": ["shipping"]
};

const inspectionTypeParameterMap = {
  inspection: ["scope-not-specified"],
  "inspection-unspecified": ["scope-not-specified"],
  "scope-not-specified": ["scope-not-specified"],
  "not-sure": ["scope-not-specified"],
  "receiving-check": ["receiving-checks"],
  "receiving-checks": ["receiving-checks"],
  receiving: ["receiving-checks"],
  "quality-inspection": ["product-quality-inspection"],
  "professional-quality-inspection": ["product-quality-inspection"],
  "product-quality-inspection": ["product-quality-inspection"],
  "cargo-inspection-receiving-checks": ["receiving-checks"]
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9][0-9\s().-]*$/;

function cleanAttributionValue(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9 _.-]/g, "")
    .slice(0, 100);
}

function getReferrerOrigin(value) {
  if (!value) return "";
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

function isValidPhone(value) {
  const trimmed = String(value || "").trim();
  if (!phonePattern.test(trimmed)) return false;
  const digitCount = trimmed.replace(/\D/g, "").length;
  return digitCount >= 7 && digitCount <= 20;
}

function isValidEmail(value) {
  const normalized = String(value || "").trim().normalize("NFKC").toLowerCase();
  if (!emailPattern.test(normalized) || normalized.includes("..")) return false;
  const [localPart, domain] = normalized.split("@");
  if (!localPart || localPart.startsWith(".") || localPart.endsWith(".")) return false;
  return domain
    .split(".")
    .every((label) => label && !label.startsWith("-") && !label.endsWith("-"));
}

function trackInquiryEvent(eventName, details = {}) {
  if (typeof window === "undefined") return;
  const payload = {
    event: eventName,
    form_source: String(details.source || "quote-page").slice(0, 80),
    shipping_method: String(details.shippingMethod || "not-sure").slice(0, 80),
    service_needs: String(details.serviceNeeds || "not-sure").slice(0, 180),
    inspection_types: String(details.inspectionTypes || "").slice(0, 180),
    result: String(details.result || "").slice(0, 40)
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("gdlogi:analytics", { detail: payload }));
}

function FieldError({ id, message }) {
  return message ? <span className="marketing-field-error" id={id}>{message}</span> : null;
}

export default function QuoteForm({
  compact = false,
  source = "quote-page",
  pageUrl = "https://gdlogi.us/quote/",
  productId = "",
  productPage = false,
  replyFieldsNearEmail = false,
  defaultShippingMethod = "not-sure",
  defaultServiceNeeds = ["not-sure"],
  defaultInspectionTypes = [],
  submitLabel = "Request a Shipping & Prep Quote"
}) {
  const [status, setStatus] = useState("idle");
  const [submissionId, setSubmissionId] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [preferredContact, setPreferredContact] = useState("email");
  const submittingRef = useRef(false);
  const startedRef = useRef(false);
  const optionalDetailsRef = useRef(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(defaultShippingMethod);
  const [selectedServiceNeeds, setSelectedServiceNeeds] = useState(defaultServiceNeeds);
  const [selectedInspectionTypes, setSelectedInspectionTypes] = useState(
    defaultInspectionTypes.length > 0
      ? defaultInspectionTypes
      : defaultServiceNeeds.includes("inspection")
        ? ["scope-not-specified"]
        : []
  );
  const [attribution, setAttribution] = useState({
    page_url: pageUrl,
    referrer: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: ""
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get("service") || params.get("solution") || "";
    const requestedShippingMethod = params.get("shipping_method") || params.get("transport_mode") || requestedService;
    if (shippingMethodParameterMap[requestedShippingMethod]) {
      setSelectedShippingMethod(shippingMethodParameterMap[requestedShippingMethod]);
    }
    const explicitNeeds = [
      ...params.getAll("service_need"),
      ...params.getAll("service_needs")
    ].flatMap((value) => value.split(","));
    const mappedNeeds = explicitNeeds
      .flatMap((value) => serviceNeedParameterMap[value] || [])
      .filter(Boolean);
    const fallbackNeeds = serviceNeedParameterMap[requestedService] || [];
    const requestedNeeds = [...new Set(mappedNeeds.length > 0 ? mappedNeeds : fallbackNeeds)];
    if (requestedNeeds.length > 0) {
      setSelectedServiceNeeds(requestedNeeds);
    }
    const explicitInspectionTypes = [
      ...params.getAll("inspection_type"),
      ...params.getAll("inspection_types")
    ].flatMap((value) => value.split(","));
    const mappedInspectionTypes = explicitInspectionTypes
      .flatMap((value) => inspectionTypeParameterMap[value] || [])
      .filter(Boolean);
    const fallbackInspectionTypes = inspectionTypeParameterMap[requestedService] || [];
    const requestedInspectionTypes = [
      ...new Set(mappedInspectionTypes.length > 0 ? mappedInspectionTypes : fallbackInspectionTypes)
    ];
    if (requestedInspectionTypes.length > 0) {
      const concreteTypes = requestedInspectionTypes.filter(
        (value) => value !== "scope-not-specified"
      );
      setSelectedInspectionTypes(
        concreteTypes.length > 0 ? concreteTypes : ["scope-not-specified"]
      );
      setSelectedServiceNeeds((current) => [
        ...current.filter((value) => value !== "not-sure" && value !== "inspection"),
        "inspection"
      ]);
    } else if (requestedNeeds.includes("inspection")) {
      setSelectedInspectionTypes(["scope-not-specified"]);
    }
    setAttribution({
      page_url: getPublicSourcePage(window.location),
      referrer: getReferrerOrigin(document.referrer),
      utm_source: cleanAttributionValue(params.get("utm_source")),
      utm_medium: cleanAttributionValue(params.get("utm_medium")),
      utm_campaign: cleanAttributionValue(params.get("utm_campaign"))
    });
  }, []);

  function validateForm(form) {
    const data = new FormData(form);
    const errors = {};
    const requiredTextFields = [
      ["name", "Please enter your name."],
      ["email", "Please enter your email address."],
      ["product_name", "Please enter the product you are shipping."],
      ["origin", "Please enter the pickup city or origin."],
      ["destination", "Please enter the destination city or ZIP code."]
    ];

    requiredTextFields.forEach(([name, message]) => {
      if (!String(data.get(name) || "").trim()) errors[name] = message;
    });

    const email = String(data.get("email") || "").trim();
    if (email && !isValidEmail(email)) {
      errors.email = "Enter a valid email address, such as audit@example.com.";
    }

    const whatsapp = String(data.get("whatsapp") || "").trim();
    if (preferredContact === "whatsapp" && !whatsapp) {
      errors.whatsapp = "A phone or WhatsApp number is required for a WhatsApp reply.";
    } else if (whatsapp && !isValidPhone(whatsapp)) {
      errors.whatsapp = "Enter a valid number using digits, spaces, +, parentheses or hyphens.";
    }

    if (data.getAll("service_needs").length === 0) {
      errors.service_needs = "Choose at least one service need or ask us to advise.";
    }
    if (
      data.getAll("service_needs").includes("inspection") &&
      data.getAll("inspection_types").length === 0
    ) {
      errors.inspection_types = "Choose the inspection type or ask us to define the scope.";
    }
    if (!form.elements.privacy_consent?.checked) {
      errors.privacy_consent = "Please confirm that we may use these details to answer your request.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      if (Object.keys(errors).some(isOptionalDetailField)) {
        optionalDetailsRef.current?.setAttribute("open", "");
      }
      setStatus("invalid");
      trackInquiryEvent("quote_submit_failed", {
        source,
        shippingMethod: selectedShippingMethod,
        serviceNeeds: selectedServiceNeeds.join(","),
        inspectionTypes: selectedInspectionTypes.join(","),
        result: "validation"
      });
      window.requestAnimationFrame(() => {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        firstInvalid?.focus();
      });
      return false;
    }
    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (submittingRef.current) {
      return;
    }

    if (!validateForm(form)) return;

    submittingRef.current = true;
    setStatus("submitting");
    try {
      const result = await submitInquiryForm(form);
      setSubmissionId(result.submission_id || "");
      if (result.submission_status === "PENDING") {
        setStatus("pending");
        trackInquiryEvent("quote_submit_pending", {
          source,
          shippingMethod: selectedShippingMethod,
          serviceNeeds: selectedServiceNeeds.join(","),
          inspectionTypes: selectedInspectionTypes.join(","),
          result: "pending"
        });
        return;
      }
      trackInquiryEvent("quote_submit_success", {
        source,
        shippingMethod: selectedShippingMethod,
        serviceNeeds: selectedServiceNeeds.join(","),
        inspectionTypes: selectedInspectionTypes.join(","),
        result: "accepted"
      });
      window.dispatchEvent(
        new CustomEvent("gdlogi:generate_lead", {
          detail: {
            source,
            productId,
            shippingMethod: selectedShippingMethod,
            serviceNeeds: selectedServiceNeeds,
            inspectionTypes: selectedInspectionTypes,
            requestId: result.request_id,
            submissionId: result.submission_id
          }
        })
      );
      window.location.assign(result.redirect || "/thank-you/");
    } catch (error) {
      setSubmissionId(error.submissionId || "");
      submittingRef.current = false;
      const serverFieldErrors = error.fieldErrors || {};
      setFieldErrors((current) => ({ ...current, ...serverFieldErrors }));
      if (Object.keys(serverFieldErrors).some(isOptionalDetailField)) {
        optionalDetailsRef.current?.setAttribute("open", "");
      }
      setStatus(Object.keys(serverFieldErrors).length > 0 ? "invalid" : "failed");
      trackInquiryEvent("quote_submit_failed", {
        source,
        shippingMethod: selectedShippingMethod,
        serviceNeeds: selectedServiceNeeds.join(","),
        inspectionTypes: selectedInspectionTypes.join(","),
        result: "rejected"
      });
      if (Object.keys(serverFieldErrors).length > 0) {
        window.requestAnimationFrame(() => {
          form.querySelector('[aria-invalid="true"]')?.focus();
        });
      }
    }
  }

  function handleInput(event) {
    const fieldName = event.target?.name;
    if (fieldName && fieldErrors[fieldName]) {
      setFieldErrors((current) => ({ ...current, [fieldName]: "" }));
    }
    if (status === "invalid" || status === "failed") setStatus("idle");
  }

  function handlePreferredContactChange(event) {
    const nextMethod = event.target.value;
    const whatsapp = String(event.currentTarget.form?.elements.whatsapp?.value || "").trim();
    setPreferredContact(nextMethod);
    setFieldErrors((current) => ({
      ...current,
      whatsapp: whatsapp && !isValidPhone(whatsapp)
        ? "Enter a valid number using digits, spaces, +, parentheses or hyphens."
        : ""
    }));
  }

  function handleStart() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackInquiryEvent("quote_start", {
      source,
      shippingMethod: selectedShippingMethod,
      serviceNeeds: selectedServiceNeeds.join(","),
      inspectionTypes: selectedInspectionTypes.join(","),
      result: "started"
    });
  }

  function handleServiceNeedChange(event) {
    const { value, checked } = event.target;
    setSelectedServiceNeeds((current) => {
      if (value === "not-sure") return checked ? ["not-sure"] : [];
      const withoutNotSure = current.filter((item) => item !== "not-sure" && item !== value);
      return checked ? [...withoutNotSure, value] : withoutNotSure;
    });
    if (value === "not-sure" && checked) {
      setSelectedInspectionTypes([]);
    } else if (value === "inspection") {
      setSelectedInspectionTypes((current) => {
        if (!checked) return [];
        return current.length > 0 ? current : ["scope-not-specified"];
      });
    }
    setFieldErrors((current) => ({ ...current, service_needs: "" }));
  }

  function handleInspectionTypeChange(event) {
    const { value, checked } = event.target;
    setSelectedInspectionTypes((current) => {
      if (value === "scope-not-specified") {
        return checked ? ["scope-not-specified"] : [];
      }
      const withoutUnspecified = current.filter(
        (item) => item !== "scope-not-specified" && item !== value
      );
      return checked ? [...withoutUnspecified, value] : withoutUnspecified;
    });
    setFieldErrors((current) => ({ ...current, inspection_types: "" }));
  }

  function isOptionalDetailField(name) {
    if (replyFieldsNearEmail && (name === "whatsapp" || name === "preferred_contact")) {
      return false;
    }
    return optionalDetailFieldNames.has(name);
  }

  const preferredReplyField = (
    <label>
      <span className="marketing-field-label">Preferred Reply Method</span>
      <select
        name="preferred_contact"
        value={preferredContact}
        onChange={handlePreferredContactChange}
      >
        <option value="email">Email</option>
        <option value="whatsapp">WhatsApp</option>
        <option value="either">Either is fine</option>
      </select>
    </label>
  );

  const whatsappPhoneField = (
    <label>
      <span className="marketing-field-label">
        WhatsApp / Phone {preferredContact === "whatsapp" ? <span aria-hidden="true">*</span> : null}
      </span>
      <input
        name="whatsapp"
        type="tel"
        autoComplete="tel"
        maxLength="50"
        required={preferredContact === "whatsapp"}
        aria-invalid={Boolean(fieldErrors.whatsapp)}
        aria-describedby={fieldErrors.whatsapp ? "quote-error-whatsapp" : undefined}
      />
      <FieldError id="quote-error-whatsapp" message={fieldErrors.whatsapp} />
    </label>
  );

  return (
    <form
      className="marketing-form"
      action="/api/inquiry/"
      method="POST"
      onSubmit={handleSubmit}
      onInput={handleInput}
      onFocusCapture={handleStart}
      noValidate
      data-lead-event="generate_lead"
    >
      <input type="hidden" name="source_type" value={source} />
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="source_page" value={attribution.page_url || pageUrl} />
      <input type="hidden" name="referrer" value={attribution.referrer} />
      <input type="hidden" name="utm_source" value={attribution.utm_source} />
      <input type="hidden" name="utm_medium" value={attribution.utm_medium} />
      <input type="hidden" name="utm_campaign" value={attribution.utm_campaign} />
      <label className="form-honeypot" aria-hidden="true">
        Leave this field empty
        <input type="text" name="_honey" tabIndex="-1" autoComplete="off" />
      </label>

      <div className="marketing-form-grid">
        <p className="marketing-form-intro form-span-two">
          Only the starred fields are required. We can confirm the remaining details with you.
        </p>
        <label>
          <span className="marketing-field-label">Name <span aria-hidden="true">*</span></span>
          <input
            name="name"
            autoComplete="name"
            maxLength="100"
            required
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "quote-error-name" : undefined}
          />
          <FieldError id="quote-error-name" message={fieldErrors.name} />
        </label>
        <label>
          <span className="marketing-field-label">Email <span aria-hidden="true">*</span></span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength="254"
            required
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "quote-error-email" : undefined}
          />
          <FieldError id="quote-error-email" message={fieldErrors.email} />
        </label>
        {replyFieldsNearEmail ? (
          <>
            {preferredReplyField}
            {whatsappPhoneField}
          </>
        ) : null}
        <label className="form-span-two">
          <span className="marketing-field-label">Product / Goods Name <span aria-hidden="true">*</span></span>
          <input
            name="product_name"
            placeholder="e.g. furniture, machinery parts or apparel"
            maxLength="180"
            required
            aria-invalid={Boolean(fieldErrors.product_name)}
            aria-describedby={fieldErrors.product_name ? "quote-error-product" : undefined}
          />
          <FieldError id="quote-error-product" message={fieldErrors.product_name} />
        </label>
        <label>
          <span className="marketing-field-label">Origin / Pickup City <span aria-hidden="true">*</span></span>
          <input
            name="origin"
            placeholder="City in China"
            maxLength="120"
            required
            aria-invalid={Boolean(fieldErrors.origin)}
            aria-describedby={fieldErrors.origin ? "quote-error-origin" : undefined}
          />
          <FieldError id="quote-error-origin" message={fieldErrors.origin} />
        </label>
        <label>
          <span className="marketing-field-label">Destination / ZIP Code <span aria-hidden="true">*</span></span>
          <input
            name="destination"
            placeholder="U.S. city, state and ZIP code"
            maxLength="160"
            required
            aria-invalid={Boolean(fieldErrors.destination)}
            aria-describedby={fieldErrors.destination ? "quote-error-destination" : undefined}
          />
          <FieldError id="quote-error-destination" message={fieldErrors.destination} />
        </label>

        <label className="form-span-two">
          <span className="marketing-field-label">Shipping Method</span>
          <select
            name="shipping_method"
            value={selectedShippingMethod}
            onChange={(event) => setSelectedShippingMethod(event.target.value)}
          >
            {shippingMethodOptions.map(([value, label]) => (
              <option value={value} key={value}>{label}</option>
            ))}
          </select>
        </label>
        {(productPage || !compact) ? (
          <>
            <label>
              <span className="marketing-field-label">Total Weight <span className="marketing-optional-label">(optional)</span></span>
              <input name="weight" placeholder="kg, lb or not sure" maxLength="100" />
            </label>
            <label>
              <span className="marketing-field-label">Total Volume <span className="marketing-optional-label">(optional)</span></span>
              <input name="volume" placeholder="CBM or not sure" maxLength="160" />
            </label>
          </>
        ) : null}

        <fieldset
          className="marketing-service-needs form-span-two"
          aria-describedby={fieldErrors.service_needs ? "quote-error-service-needs" : "quote-service-needs-help"}
        >
          <legend>Service Needs <span aria-hidden="true">*</span></legend>
          <p id="quote-service-needs-help">Choose all that apply. Shipping method is selected separately.</p>
          <div className="marketing-checkbox-grid">
            {serviceNeedOptions.map(([value, label]) => (
              <label key={value}>
                <input
                  type="checkbox"
                  name="service_needs"
                  value={value}
                  checked={selectedServiceNeeds.includes(value)}
                  onChange={handleServiceNeedChange}
                  aria-invalid={Boolean(fieldErrors.service_needs)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <FieldError id="quote-error-service-needs" message={fieldErrors.service_needs} />
        </fieldset>
        {selectedServiceNeeds.includes("inspection") ? (
          <fieldset
            className="marketing-service-needs form-span-two"
            aria-describedby={fieldErrors.inspection_types ? "quote-error-inspection-types" : "quote-inspection-types-help"}
          >
            <legend>Inspection Type <span aria-hidden="true">*</span></legend>
            <p id="quote-inspection-types-help">Receiving checks and product-quality inspection are separate. Choose both if both are needed.</p>
            <div className="marketing-checkbox-grid">
              {inspectionTypeOptions.map(([value, label]) => (
                <label key={value}>
                  <input
                    type="checkbox"
                    name="inspection_types"
                    value={value}
                    checked={selectedInspectionTypes.includes(value)}
                    onChange={handleInspectionTypeChange}
                    aria-invalid={Boolean(fieldErrors.inspection_types)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <FieldError id="quote-error-inspection-types" message={fieldErrors.inspection_types} />
          </fieldset>
        ) : null}
        <details className="marketing-optional-details form-span-two" ref={optionalDetailsRef}>
          <summary>Add shipment details <span>(optional)</span></summary>
          <div className="marketing-form-grid marketing-optional-details-grid">
            <label>
              <span className="marketing-field-label">Company</span>
              <input name="company" autoComplete="organization" maxLength="160" />
            </label>
            {replyFieldsNearEmail ? null : whatsappPhoneField}
            <label>
              <span className="marketing-field-label">Cargo Ready Date</span>
              <input name="cargo_ready_date" type="date" />
            </label>
            {replyFieldsNearEmail ? null : preferredReplyField}
            <label>
              <span className="marketing-field-label">Carton / Pallet Quantity</span>
              <input name="package_count" inputMode="numeric" maxLength="80" />
            </label>
            <label>
              <span className="marketing-field-label">Packed Dimensions</span>
              <input name="dimensions" placeholder="L × W × H and unit" maxLength="160" />
            </label>
            <label className="form-span-two">
              <span className="marketing-field-label">Cargo Details</span>
              <textarea
                name="cargo_type"
                rows="4"
                placeholder={productPage
                  ? "Packaging, carton or pallet details, and handling requirements"
                  : "Packaging and any special handling needs"}
                maxLength="2000"
              />
            </label>
            {(productPage || !compact) ? (
              <label className="form-span-two">
                <span className="marketing-field-label">Additional Notes</span>
                <textarea
                  name="message"
                  rows="3"
                  placeholder={productPage
                    ? "FBA appointment, liftgate, residential access, oversized handling or other requirements"
                    : "FBA, liftgate, residential delivery, customs or other requirements"}
                  maxLength="2000"
                />
              </label>
            ) : null}
          </div>
        </details>
      </div>

      <label className="marketing-consent">
        <input
          type="checkbox"
          name="privacy_consent"
          value="agreed"
          required
          aria-invalid={Boolean(fieldErrors.privacy_consent)}
          aria-describedby={fieldErrors.privacy_consent ? "quote-error-consent" : undefined}
        />
        <span>
          I agree that Good Logistics may use these details to respond to my shipping request. See the{" "}
          <a href="/privacy-policy/">Privacy Policy</a>. <span aria-hidden="true">*</span>
          <FieldError id="quote-error-consent" message={fieldErrors.privacy_consent} />
        </span>
      </label>
      <button
        className="marketing-button marketing-button-primary"
        type="submit"
        disabled={status === "submitting" || status === "pending"}
      >
        {status === "submitting"
          ? "Sending…"
          : status === "pending"
            ? "Inquiry Processing…"
            : submitLabel}
      </button>
      <p className={`marketing-form-status status-${status}`} role="status" aria-live="polite">
        {status === "invalid"
          ? "Please complete the required fields and check the highlighted entries."
          : status === "failed"
            ? INQUIRY_FAILURE_MESSAGE
            : status === "pending"
              ? (
                <>
                  {INQUIRY_PENDING_MESSAGE}
                  {submissionId ? <> Reference: {submissionId}.</> : null}{" "}
                  If you need to add information, contact us by{" "}
                  <a
                    href="https://wa.me/8613556861676"
                    data-analytics-owned="true"
                    onClick={() => trackInquiryEvent("whatsapp_click", { source, shippingMethod: selectedShippingMethod, serviceNeeds: selectedServiceNeeds.join(","), result: "pending-help" })}
                  >WhatsApp</a> or{" "}
                  <a
                    href="mailto:zoe@gdlogi.com"
                    data-analytics-owned="true"
                    onClick={() => trackInquiryEvent("email_click", { source, shippingMethod: selectedShippingMethod, serviceNeeds: selectedServiceNeeds.join(","), result: "pending-help" })}
                  >email</a>.
                </>
              )
            : "Email and WhatsApp responses are available. If the form does not complete, email zoe@gdlogi.com."}
      </p>
    </form>
  );
}
