import { useMemo, useState } from "react";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  requirement: "",
  message: "",
  website: ""
};

const validators = {
  name(value) {
    return value.trim().length >= 2 ? "" : "Please enter your name.";
  },
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
      ? ""
      : "Please enter a valid email address.";
  },
  phone(value) {
    return /^\+?[0-9][0-9\s().-]{6,22}$/.test(value.trim())
      ? ""
      : "Please enter a valid phone or WhatsApp number.";
  }
};

const defaultHints = {
  name: "Please enter your name.",
  email: "Use a valid business email address.",
  phone: "International format is supported, e.g. +1 213 555 0188.",
  company: "Optional, but helpful for B2B quote follow-up.",
  country: "Optional destination or buyer location.",
  requirement: "Optional. Tell us the service or cargo type you need.",
  message: "Optional. More cargo details help us quote faster."
};

export default function GoodShippingInquiryForm({
  endpoint = "",
  logoSrc = "/logo.png",
  locale = "en",
  onSuccess
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    type: "",
    message: "Complete the required fields, then submit your inquiry."
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredFields = useMemo(() => ["name", "email", "phone"], []);

  function updateField(name, value) {
    setValues((current) => ({ ...current, [name]: value }));

    if (validators[name]) {
      const message = validators[name](value);
      setErrors((current) => ({ ...current, [name]: message }));
    }
  }

  function validate() {
    const nextErrors = {};

    requiredFields.forEach((name) => {
      const message = validators[name](values[name] || "");
      if (message) nextErrors[name] = message;
    });

    if (values.website) {
      nextErrors.website = "Spam protection triggered.";
    }

    setErrors(nextErrors);
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length) {
      setStatus({
        type: "error",
        message: "Please complete the required fields before submitting."
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "Submitting your inquiry..." });

    try {
      const payload = {
        ...values,
        locale,
        language: locale,
        source: "Good Logistics Co., Ltd. B2B inquiry page",
        submittedAt: new Date().toISOString()
      };

      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Submission failed");
      } else {
        // Preview fallback only. Replace with endpoint for production.
        const saved = JSON.parse(localStorage.getItem("goodShippingInquiries") || "[]");
        saved.push(payload);
        localStorage.setItem("goodShippingInquiries", JSON.stringify(saved));
        await new Promise((resolve) => setTimeout(resolve, 650));
      }

      setValues(initialValues);
      setErrors({});
      setStatus({
        type: "success",
        message: "Submitted successfully. Our logistics team will contact you soon."
      });
      onSuccess?.(payload);
    } catch (error) {
      setStatus({
        type: "error",
        message: "Submission failed. Please try again or contact us by email / WhatsApp."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function Field({ name, label, required, type = "text", placeholder, autoComplete }) {
    const invalid = Boolean(errors[name]);
    return (
      <div className={`gs-field ${invalid ? "is-invalid" : ""}`}>
        <label htmlFor={name}>
          {label}
          {required ? <span aria-label="required">*</span> : null}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={values[name]}
          required={required}
          onChange={(event) => updateField(name, event.target.value)}
        />
        <small>{errors[name] || defaultHints[name]}</small>
      </div>
    );
  }

  return (
    <section className="gs-inquiry">
      <div className="gs-inquiry__intro">
        <div className="gs-logo">
          <img src={logoSrc} alt="Good Logistics Co., Ltd." />
        </div>
        <h1>Get a Clear China to USA Shipping Quote</h1>
        <p>
          Tell us what you need to ship. Our team will review the cargo details,
          destination and delivery requirements before recommending air freight,
          sea freight, DDP, Amazon FBA or oversized cargo solutions.
        </p>
      </div>

      <form className="gs-form" onSubmit={handleSubmit} noValidate>
        <input
          className="gs-honeypot"
          name="website"
          value={values.website}
          onChange={(event) => updateField("website", event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="gs-form__head">
          <div>
            <h2>B2B Inquiry Form</h2>
            <p>Required fields are marked clearly. Validation tips appear before submission.</p>
          </div>
          <strong>* Required</strong>
        </div>

        <div className="gs-form__grid">
          <Field name="name" label="Name" required placeholder="Your full name" autoComplete="name" />
          <Field name="email" label="Email" required type="email" placeholder="name@company.com" autoComplete="email" />
          <Field name="phone" label="Phone / WhatsApp" required type="tel" placeholder="+1 213 555 0188" autoComplete="tel" />
          <Field name="company" label="Company Name" placeholder="Your company name" autoComplete="organization" />
          <Field name="country" label="Country / Region" placeholder="United States / Mexico / UK" autoComplete="country-name" />
          <Field name="requirement" label="Product Requirement" placeholder="Air freight, sea freight, DDP, FBA..." />

          <div className="gs-field gs-field--full">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Cargo name, pickup city, destination, weight, volume, cartons, pallets, Incoterms, delivery deadline..."
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
            />
            <small>{defaultHints.message}</small>
          </div>
        </div>

        <div className="gs-form__actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Inquiry"}
          </button>
          <p className={`gs-status gs-status--${status.type || "idle"}`} role="status" aria-live="polite">
            {status.message}
          </p>
        </div>
      </form>
    </section>
  );
}
