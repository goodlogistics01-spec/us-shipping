"use client";

import { useEffect } from "react";
import {
  getPublicSourcePage,
  INQUIRY_FAILURE_MESSAGE,
  INQUIRY_PENDING_MESSAGE,
  submitInquiryForm
} from "./lib/inquiry-client";

const PHONE_MESSAGE =
  "Enter a phone number using digits and common separators such as +, spaces, parentheses or hyphens.";

function isValidEmail(value) {
  const normalized = String(value || "").trim().normalize("NFKC").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || normalized.includes("..")) {
    return false;
  }
  const [localPart, domain] = normalized.split("@");
  if (!localPart || localPart.startsWith(".") || localPart.endsWith(".")) return false;
  return domain
    .split(".")
    .every((label) => label && !label.startsWith("-") && !label.endsWith("-"));
}

function emitAnonymousEvent(eventName, parameters = {}) {
  const detail = {
    event: eventName,
    source_type: "homepage",
    page_path: window.location.pathname,
    ...parameters
  };

  window.dispatchEvent(new CustomEvent("gdlogi:analytics", { detail }));
  if (Array.isArray(window.dataLayer)) window.dataLayer.push(detail);
}

function getSafeSourcePage() {
  try {
    const url = new URL(getPublicSourcePage(window.location));
    return `${url.origin}${url.pathname}`;
  } catch {
    return "https://gdlogi.us/";
  }
}

function getSafeReferrer() {
  if (!document.referrer) return "direct";

  try {
    const url = new URL(document.referrer);
    return url.origin === window.location.origin ? `${url.origin}${url.pathname}` : url.origin;
  } catch {
    return "unknown";
  }
}

function getCampaignValue(name, maxLength) {
  const value = new URLSearchParams(window.location.search).get(name) || "";
  return value
    .trim()
    .slice(0, maxLength)
    .replace(/[^a-zA-Z0-9._~+ -]/g, "");
}

export default function HomeInteractions() {
  useEffect(() => {
    const header = document.querySelector("[data-home-header]");
    const menuToggle = document.querySelector("[data-home-menu-toggle]");
    const menuLabel = document.querySelector("[data-home-menu-label]");
    const navItems = Array.from(document.querySelectorAll("[data-home-nav-item]"));
    const form = document.querySelector("[data-home-quote-form]");

    const setMenuLabel = (isOpen) => {
      const label = isOpen ? "Close navigation menu" : "Open navigation menu";
      menuToggle?.setAttribute("aria-label", label);
      if (menuLabel) menuLabel.textContent = label;
    };

    const closeDropdowns = (exceptItem = null) => {
      navItems.forEach((item) => {
        if (item === exceptItem) return;
        item.classList.remove("is-open");
        item.querySelector("[data-home-nav-trigger]")?.setAttribute("aria-expanded", "false");
      });
    };

    const closeMobileMenu = ({ restoreFocus = false } = {}) => {
      if (!header || !menuToggle) return;
      const wasOpen = header.classList.contains("is-menu-open");
      header.classList.remove("is-menu-open");
      document.body.classList.remove("home-menu-lock");
      menuToggle.setAttribute("aria-expanded", "false");
      setMenuLabel(false);
      closeDropdowns();
      if (restoreFocus && wasOpen) menuToggle.focus();
    };

    const navLinks = Array.from(document.querySelectorAll("#home-primary-navigation a"));

    const onMenuToggle = () => {
      if (!header || !menuToggle) return;
      const isOpen = header.classList.toggle("is-menu-open");
      document.body.classList.toggle("home-menu-lock", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      setMenuLabel(isOpen);
      if (isOpen) {
        window.requestAnimationFrame(() => navLinks[0]?.focus());
      } else {
        closeDropdowns();
      }
    };

    const navTriggerHandlers = navItems.map((item) => {
      const trigger = item.querySelector("[data-home-nav-trigger]");
      const handler = () => {
        const shouldOpen = !item.classList.contains("is-open");
        closeDropdowns(item);
        item.classList.toggle("is-open", shouldOpen);
        trigger?.setAttribute("aria-expanded", String(shouldOpen));
      };
      trigger?.addEventListener("click", handler);
      return [trigger, handler];
    });

    const onDocumentClick = (event) => {
      const contactLink = event.target.closest?.("[data-contact-event]");
      if (contactLink?.dataset.contactEvent) {
        emitAnonymousEvent(contactLink.dataset.contactEvent, {
          contact_method: contactLink.dataset.contactEvent === "whatsapp_click" ? "whatsapp" : "email"
        });
      }

      if (header && !header.contains(event.target)) closeMobileMenu();
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMobileMenu({ restoreFocus: true });
    };

    const onNavLinkClick = () => closeMobileMenu();
    const desktopMedia = window.matchMedia("(min-width: 1101px)");
    const onDesktopChange = (event) => {
      if (event.matches) closeMobileMenu();
    };

    menuToggle?.addEventListener("click", onMenuToggle);
    navLinks.forEach((link) => link.addEventListener("click", onNavLinkClick));
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);
    desktopMedia.addEventListener("change", onDesktopChange);

    let onFocusIn;
    let onInput;
    let onInvalid;
    let onSubmit;
    let onPageShow;
    let onPreferredContactChange;

    if (form) {
      const submitButton = form.querySelector("[data-home-submit]");
      const status = form.querySelector("[data-home-form-status]");
      const preferredContact = form.elements.preferred_contact;
      const phone = form.elements.whatsapp;
      const email = form.elements.email;
      const optionalDetails = form.querySelector("[data-home-optional-details]");
      const phoneRequiredIndicator = form.querySelector("[data-home-phone-required]");
      const serviceNeedInputs = Array.from(form.querySelectorAll('input[name="service_needs"]'));
      const inspectionTypesFieldset = form.querySelector("[data-home-inspection-types]");
      const inspectionTypeInputs = Array.from(
        form.querySelectorAll('input[name="inspection_types"]')
      );
      let quoteStarted = false;
      let focusScheduled = false;

      const setAttributionFields = () => {
        if (form.elements.source_page) form.elements.source_page.value = getSafeSourcePage();
        if (form.elements.referrer) form.elements.referrer.value = getSafeReferrer();
        if (form.elements.utm_source) {
          form.elements.utm_source.value = getCampaignValue("utm_source", 100);
        }
        if (form.elements.utm_medium) {
          form.elements.utm_medium.value = getCampaignValue("utm_medium", 100);
        }
        if (form.elements.utm_campaign) {
          form.elements.utm_campaign.value = getCampaignValue("utm_campaign", 160);
        }
      };

      const getErrorElement = (field) => {
        const ids = (field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
        return ids
          .map((id) => document.getElementById(id))
          .find((element) => element?.matches("[data-field-error]"));
      };

      const getValidationMessage = (field) => {
        if (field.validity.typeMismatch && field.type === "email") {
          return "Enter a valid email address.";
        }
        if (field.validity.valueMissing) return "This field is required.";
        return field.validationMessage || "Check this field.";
      };

      const showFieldError = (field) => {
        if (optionalDetails?.contains(field)) optionalDetails.open = true;
        field.setAttribute("aria-invalid", "true");
        const errorElement = getErrorElement(field);
        if (errorElement) errorElement.textContent = getValidationMessage(field);
      };

      const clearFieldError = (field) => {
        field.removeAttribute("aria-invalid");
        const errorElement = getErrorElement(field);
        if (errorElement) errorElement.textContent = "";
      };

      const validatePhone = () => {
        if (!phone || !preferredContact) return true;
        const isRequired = preferredContact.value === "whatsapp";
        const value = phone.value.trim();
        phone.required = isRequired;
        if (phoneRequiredIndicator) phoneRequiredIndicator.hidden = !isRequired;
        phone.setCustomValidity("");

        if (isRequired && !value) {
          phone.setCustomValidity("Enter a WhatsApp or phone number for a WhatsApp reply.");
        } else if (value) {
          const digitCount = (value.match(/\d/g) || []).length;
          if (!/^\+?[0-9][0-9\s().-]*$/.test(value) || digitCount < 7 || digitCount > 20) {
            phone.setCustomValidity(PHONE_MESSAGE);
          }
        }

        if (phone.validity.valid) {
          clearFieldError(phone);
          return true;
        }

        showFieldError(phone);
        return false;
      };

      const validateEmail = () => {
        if (!email) return true;
        email.setCustomValidity("");
        if (!email.value.trim()) {
          clearFieldError(email);
          return true;
        }
        if (!isValidEmail(email.value)) {
          email.setCustomValidity("Enter a valid email address.");
        }
        if (email.validity.valid) {
          clearFieldError(email);
          return true;
        }
        showFieldError(email);
        return false;
      };

      const inspectionSelected = () => serviceNeedInputs.some(
        (input) => input.checked && input.value === "inspection"
      );

      const syncInspectionTypes = () => {
        const enabled = inspectionSelected();
        if (inspectionTypesFieldset) inspectionTypesFieldset.hidden = !enabled;
        inspectionTypeInputs.forEach((input) => {
          input.disabled = !enabled;
          if (!enabled) {
            input.checked = false;
            input.setCustomValidity("");
            clearFieldError(input);
          }
        });
        if (
          enabled &&
          inspectionTypeInputs.length > 0 &&
          !inspectionTypeInputs.some((input) => input.checked)
        ) {
          const unspecified = inspectionTypeInputs.find(
            (input) => input.value === "scope-not-specified"
          );
          if (unspecified) unspecified.checked = true;
        }
      };

      const validateInspectionTypes = () => {
        if (!inspectionSelected() || inspectionTypeInputs.length === 0) return true;
        const hasSelection = inspectionTypeInputs.some((input) => input.checked);
        const firstInput = inspectionTypeInputs[0];
        firstInput.setCustomValidity(
          hasSelection ? "" : "Choose the inspection type or ask us to define the scope."
        );
        inspectionTypeInputs.forEach((input) => {
          input.toggleAttribute("aria-invalid", !hasSelection);
        });
        if (hasSelection) {
          clearFieldError(firstInput);
          return true;
        }
        showFieldError(firstInput);
        return false;
      };

      const getSelectionContext = () => ({
        shipping_method: form.elements.shipping_method?.value || "not-sure",
        service_needs: serviceNeedInputs
          .filter((input) => input.checked)
          .map((input) => input.value)
          .join(",") || "not-sure",
        inspection_types: inspectionTypeInputs
          .filter((input) => input.checked)
          .map((input) => input.value)
          .join(",")
      });

      const validateServiceNeeds = () => {
        if (serviceNeedInputs.length === 0) return true;
        const hasSelection = serviceNeedInputs.some((input) => input.checked);
        const firstInput = serviceNeedInputs[0];
        firstInput.setCustomValidity(hasSelection ? "" : "Choose at least one service need or ask us to advise.");
        serviceNeedInputs.forEach((input) => {
          input.toggleAttribute("aria-invalid", !hasSelection);
        });
        if (hasSelection) {
          clearFieldError(firstInput);
          return true;
        }
        showFieldError(firstInput);
        return false;
      };

      const showPendingStatus = (submissionId) => {
        if (!status) return;
        const reference = submissionId ? ` Reference: ${submissionId}. ` : " ";
        const whatsAppLink = document.createElement("a");
        whatsAppLink.href =
          "https://wa.me/8613556861676?text=Hello%20Good%20Logistics%2C%20I%27d%20like%20help%20with%20an%20inquiry%20that%20is%20still%20processing.";
        whatsAppLink.textContent = "WhatsApp";
        whatsAppLink.dataset.contactEvent = "whatsapp_click";
        const emailLink = document.createElement("a");
        emailLink.href = "mailto:zoe@gdlogi.com";
        emailLink.textContent = "email";
        emailLink.dataset.contactEvent = "email_click";
        status.replaceChildren(
          document.createTextNode(`${INQUIRY_PENDING_MESSAGE}${reference}`),
          document.createTextNode("If you need to add information, contact us by "),
          whatsAppLink,
          document.createTextNode(" or "),
          emailLink,
          document.createTextNode(".")
        );
        status.classList.remove("is-error");
        status.classList.add("is-pending");
      };

      onFocusIn = () => {
        if (quoteStarted) return;
        quoteStarted = true;
        emitAnonymousEvent("quote_start", {
          form_id: "homepage_quick_quote",
          ...getSelectionContext()
        });
      };

      onPreferredContactChange = () => validatePhone();

      onInvalid = (event) => {
        const field = event.target;
        showFieldError(field);
        if (status) {
          status.textContent = "Please complete the required fields and check the highlighted entries.";
          status.classList.remove("is-pending");
          status.classList.add("is-error");
        }
        if (!focusScheduled) {
          focusScheduled = true;
          emitAnonymousEvent("quote_validation_error", {
            form_id: "homepage_quick_quote",
            field_name: field.name || "unknown"
          });
          emitAnonymousEvent("quote_submit_failed", {
            form_id: "homepage_quick_quote",
            result: "validation",
            failure_code: "validation"
          });
          window.requestAnimationFrame(() => {
            form.querySelector(":invalid")?.focus();
            focusScheduled = false;
          });
        }
      };

      onSubmit = async (event) => {
        event.preventDefault();
        if (submitButton?.disabled) return;
        validatePhone();
        validateEmail();
        validateServiceNeeds();
        validateInspectionTypes();
        if (!form.checkValidity()) return;

        setAttributionFields();
        form.dataset.submissionState = "submitting";
        form.dataset.submissionId = "";
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Sending…";
        }
        if (status) {
          status.classList.remove("is-pending");
          status.classList.remove("is-error");
          status.textContent = "Sending your shipment details…";
        }

        try {
          const result = await submitInquiryForm(form);
          form.dataset.submissionState = result.submission_status?.toLowerCase() || "pending";
          form.dataset.submissionId = result.submission_id || "";
          if (result.submission_status === "PENDING") {
            if (submitButton) submitButton.textContent = "Inquiry Processing…";
            emitAnonymousEvent("quote_submit_pending", {
              form_id: "homepage_quick_quote",
              ...getSelectionContext()
            });
            showPendingStatus(result.submission_id);
            return;
          }

          emitAnonymousEvent("quote_submit_success", {
            form_id: "homepage_quick_quote",
            ...getSelectionContext()
          });
          window.dispatchEvent(
            new CustomEvent("gdlogi:generate_lead", {
              detail: { source: "homepage-quick-quote", ...getSelectionContext() }
            })
          );
          window.location.assign(result.redirect || "/thank-you/");
        } catch (error) {
          form.dataset.submissionState = "failed";
          form.dataset.submissionId = error.submissionId || "";
          const serverFieldErrors = error.fieldErrors || {};
          Object.entries(serverFieldErrors).forEach(([name, message]) => {
            const field = name === "service_needs"
              ? serviceNeedInputs[0]
              : name === "inspection_types"
                ? inspectionTypeInputs[0]
                : form.elements[name];
            if (!field) return;
            field.setCustomValidity(message);
            showFieldError(field);
          });
          emitAnonymousEvent("quote_submit_failed", {
            form_id: "homepage_quick_quote",
            failure_code: error.code || "delivery_failed"
          });
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Request a Shipping & Prep Quote";
          }
          if (status) {
            status.classList.remove("is-pending");
            status.classList.add("is-error");
            status.textContent = Object.keys(serverFieldErrors).length > 0
              ? "Please complete the required fields and check the highlighted entries."
              : INQUIRY_FAILURE_MESSAGE;
          }
          if (Object.keys(serverFieldErrors).length > 0) {
            window.requestAnimationFrame(() => {
              form.querySelector(":invalid")?.focus();
            });
          }
        }
      };

      onInput = (event) => {
        if (event.target === phone || event.target === preferredContact) validatePhone();
        if (event.target === email) validateEmail();
        if (event.target.name === "service_needs") {
          if (event.target.checked && event.target.value === "not-sure") {
            serviceNeedInputs.forEach((input) => {
              if (input !== event.target) input.checked = false;
            });
          } else if (event.target.checked) {
            const notSureInput = serviceNeedInputs.find((input) => input.value === "not-sure");
            if (notSureInput) notSureInput.checked = false;
          }
          syncInspectionTypes();
          validateServiceNeeds();
          validateInspectionTypes();
        } else if (event.target.name === "inspection_types") {
          if (event.target.checked && event.target.value === "scope-not-specified") {
            inspectionTypeInputs.forEach((input) => {
              if (input !== event.target) input.checked = false;
            });
          } else if (event.target.checked) {
            const unspecified = inspectionTypeInputs.find(
              (input) => input.value === "scope-not-specified"
            );
            if (unspecified) unspecified.checked = false;
          }
          validateInspectionTypes();
        } else if (event.target !== phone && event.target !== email) {
          event.target.setCustomValidity?.("");
        }
        if (event.target.validity?.valid) clearFieldError(event.target);
        if (
          !status ||
          form.dataset.submissionState === "pending" ||
          form.querySelectorAll(":invalid").length > 0
        ) {
          return;
        }
        status.classList.remove("is-pending");
        status.classList.remove("is-error");
        status.textContent = "If the form does not complete, email zoe@gdlogi.com.";
      };

      onPageShow = () => {
        if (form.dataset.submissionState === "pending") {
          if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Inquiry Processing…";
          }
          showPendingStatus(form.dataset.submissionId);
          return;
        }
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Request a Shipping & Prep Quote";
        }
      };

      setAttributionFields();
      validatePhone();
      validateEmail();
      validateServiceNeeds();
      syncInspectionTypes();
      validateInspectionTypes();
      form.addEventListener("focusin", onFocusIn);
      form.addEventListener("invalid", onInvalid, true);
      form.addEventListener("input", onInput);
      form.addEventListener("submit", onSubmit);
      preferredContact?.addEventListener("change", onPreferredContactChange);
      window.addEventListener("pageshow", onPageShow);
    }

    return () => {
      document.body.classList.remove("home-menu-lock");
      menuToggle?.removeEventListener("click", onMenuToggle);
      navLinks.forEach((link) => link.removeEventListener("click", onNavLinkClick));
      navTriggerHandlers.forEach(([trigger, handler]) => trigger?.removeEventListener("click", handler));
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
      desktopMedia.removeEventListener("change", onDesktopChange);
      if (form) {
        if (onFocusIn) form.removeEventListener("focusin", onFocusIn);
        if (onInvalid) form.removeEventListener("invalid", onInvalid, true);
        if (onInput) form.removeEventListener("input", onInput);
        if (onSubmit) form.removeEventListener("submit", onSubmit);
        if (onPreferredContactChange) {
          form.elements.preferred_contact?.removeEventListener("change", onPreferredContactChange);
        }
      }
      if (onPageShow) window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
