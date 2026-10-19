"use client";

import { useEffect, useState } from "react";

export default function QuoteForm({
  compact = false,
  source = "quote-page",
  pageUrl = "https://gdlogi.us/quote/",
  productId = "",
  productName = "",
  productPage = false,
  submitLabel = "Get a Shipping Quote"
}) {
  const [status, setStatus] = useState("idle");
  const [attribution, setAttribution] = useState({
    page_url: pageUrl,
    referrer: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: ""
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setAttribution({
      page_url: window.location.href,
      referrer: document.referrer,
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || ""
    });
  }, []);

  function handleSubmit(event) {
    if (status === "submitting") {
      event.preventDefault();
      return;
    }

    if (!event.currentTarget.checkValidity()) {
      setStatus("invalid");
      return;
    }

    setStatus("submitting");
    window.dispatchEvent(
      new CustomEvent("gdlogi:generate_lead", {
        detail: { source, productId }
      })
    );
  }

  function handleInput() {
    if (status === "invalid") setStatus("idle");
  }

  return (
    <form
      className="marketing-form"
      action="https://formsubmit.co/zoe@gdlogi.com"
      method="POST"
      onSubmit={handleSubmit}
      onInvalid={() => setStatus("invalid")}
      onInput={handleInput}
      data-lead-event="generate_lead"
    >
      <input type="hidden" name="_subject" value={`New freight inquiry from ${productName || source}`} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_next" value="https://gdlogi.us/thank-you/" />
      <input type="hidden" name="_url" value={attribution.page_url || pageUrl} />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="product_name" value={productName} />
      <input type="hidden" name="page_url" value={attribution.page_url} />
      <input type="hidden" name="referrer" value={attribution.referrer} />
      <input type="hidden" name="utm_source" value={attribution.utm_source} />
      <input type="hidden" name="utm_medium" value={attribution.utm_medium} />
      <input type="hidden" name="utm_campaign" value={attribution.utm_campaign} />
      <label className="form-honeypot" aria-hidden="true">
        Leave this field empty
        <input type="text" name="_honey" tabIndex="-1" autoComplete="off" />
      </label>

      <div className="marketing-form-grid">
        <label>
          Name <span aria-hidden="true">*</span>
          <input name="name" autoComplete="name" maxLength="100" required />
        </label>
        <label>
          Company
          <input name="company" autoComplete="organization" maxLength="160" />
        </label>
        <label>
          Email <span aria-hidden="true">*</span>
          <input name="email" type="email" autoComplete="email" maxLength="254" required />
        </label>
        <label>
          WhatsApp / Phone
          <input name="phone" type="tel" autoComplete="tel" maxLength="50" />
        </label>
        <label>
          Origin / Pickup City <span aria-hidden="true">*</span>
          <input name="origin_city" placeholder="City in China" maxLength="120" required />
        </label>
        <label>
          Destination / ZIP Code <span aria-hidden="true">*</span>
          <input name="destination" placeholder="U.S. city, state and ZIP code" maxLength="160" required />
        </label>

        {productPage ? (
          <>
            <label>
              Shipping Mode <span aria-hidden="true">*</span>
              <select name="shipping_method" defaultValue="" required>
                <option value="" disabled>Select an option</option>
                <option value="fcl">FCL</option>
                <option value="lcl">LCL</option>
                <option value="door-to-door">Door-to-Door</option>
                <option value="amazon-fba">Amazon FBA</option>
                <option value="oversized">Oversized Cargo</option>
                <option value="not-sure">Not Sure</option>
              </select>
            </label>
            <label>
              Cargo Volume / Weight <span aria-hidden="true">*</span>
              <input
                name="cargo_volume_weight"
                placeholder="CBM, kg/lb, or packed dimensions"
                maxLength="160"
                required
              />
            </label>
            <label className="form-span-two">
              Cargo Description <span aria-hidden="true">*</span>
              <textarea
                name="cargo_description"
                rows="4"
                placeholder="Products, packaging and handling requirements"
                maxLength="2000"
                required
              />
            </label>
            <label>
              Carton / Pallet Quantity
              <input name="package_count" inputMode="numeric" maxLength="80" />
            </label>
            <label>
              Packed Dimensions
              <input name="dimensions" placeholder="L × W × H and unit" maxLength="160" />
            </label>
            <label>
              Cargo Ready Date
              <input name="cargo_ready_date" type="date" />
            </label>
            <label>
              Preferred Reply Method
              <select name="preferred_contact" defaultValue="email">
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="either">Either</option>
              </select>
            </label>
            <label className="form-span-two">
              Special Requirements
              <textarea
                name="additional_requirements"
                rows="3"
                placeholder="FBA appointment, liftgate, residential access, oversized handling or other requirements"
                maxLength="2000"
              />
            </label>
          </>
        ) : (
          <>
            <label>
              Shipping Method
              <select name="shipping_method" defaultValue="review-needed">
                <option value="review-needed">Please recommend</option>
                <option value="sea-freight">Sea Freight</option>
                <option value="air-freight">Air Freight</option>
                <option value="ddp">DDP Door-to-Door</option>
                <option value="amazon-fba">Amazon FBA</option>
                <option value="oversized">Oversized Cargo</option>
              </select>
            </label>
            <label>
              Cargo Ready Date
              <input name="cargo_ready_date" type="date" />
            </label>
            <label className="form-span-two">
              Cargo Description <span aria-hidden="true">*</span>
              <textarea
                name="cargo_description"
                rows="4"
                placeholder="Product, packaging and any special handling needs"
                maxLength="2000"
                required
              />
            </label>
            {!compact && (
              <>
                <label>
                  Number of Cartons / Pallets
                  <input name="package_count" inputMode="numeric" maxLength="80" />
                </label>
                <label>
                  Total Weight
                  <input name="total_weight" placeholder="kg or lb" maxLength="80" />
                </label>
                <label>
                  Total Volume
                  <input name="total_volume" placeholder="CBM or dimensions" maxLength="120" />
                </label>
                <label>
                  Preferred Reply Method
                  <select name="preferred_contact" defaultValue="email">
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="either">Either</option>
                  </select>
                </label>
                <label className="form-span-two">
                  Additional Requirements
                  <textarea
                    name="additional_requirements"
                    rows="3"
                    placeholder="FBA, liftgate, residential delivery, customs or other requirements"
                    maxLength="2000"
                  />
                </label>
              </>
            )}
          </>
        )}
      </div>

      <label className="marketing-consent">
        <input type="checkbox" name="privacy_consent" value="agreed" required />
        <span>
          I agree that Good Logistics may use these details to respond to my shipping request. See the{" "}
          <a href="/privacy-policy/">Privacy Policy</a>. <span aria-hidden="true">*</span>
        </span>
      </label>
      <button className="marketing-button marketing-button-primary" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : submitLabel}
      </button>
      <p className={`marketing-form-status status-${status}`} role="status" aria-live="polite">
        {status === "invalid"
          ? "Please complete the required fields and check the highlighted entries."
          : "Email and WhatsApp responses are available. If the form does not complete, email zoe@gdlogi.com."}
      </p>
    </form>
  );
}
