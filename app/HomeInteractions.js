"use client";

import { useEffect } from "react";

export default function HomeInteractions() {
  useEffect(() => {
    const header = document.querySelector("[data-home-header]");
    const menuToggle = document.querySelector("[data-home-menu-toggle]");
    const navItems = Array.from(document.querySelectorAll("[data-home-nav-item]"));
    const form = document.querySelector("[data-home-quote-form]");

    const closeDropdowns = (exceptItem = null) => {
      navItems.forEach((item) => {
        if (item === exceptItem) return;
        item.classList.remove("is-open");
        item.querySelector("[data-home-nav-trigger]")?.setAttribute("aria-expanded", "false");
      });
    };

    const closeMobileMenu = () => {
      if (!header || !menuToggle) return;
      header.classList.remove("is-menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      closeDropdowns();
    };

    const onMenuToggle = () => {
      if (!header || !menuToggle) return;
      const isOpen = header.classList.toggle("is-menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) closeDropdowns();
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
      if (header && !header.contains(event.target)) {
        closeDropdowns();
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMobileMenu();
    };

    const onNavLinkClick = () => closeMobileMenu();
    const navLinks = Array.from(document.querySelectorAll("#home-primary-navigation a"));

    menuToggle?.addEventListener("click", onMenuToggle);
    navLinks.forEach((link) => link.addEventListener("click", onNavLinkClick));
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);

    let onInvalid;
    let onSubmit;
    let onPageShow;
    let onInput;

    if (form) {
      const submitButton = form.querySelector("[data-home-submit]");
      const status = form.querySelector("[data-home-form-status]");

      onInvalid = () => {
        if (!status) return;
        status.textContent = "Please complete the required fields and check the highlighted entries.";
        status.classList.add("is-error");
      };

      onSubmit = (event) => {
        if (submitButton?.disabled) {
          event.preventDefault();
          return;
        }
        if (!form.checkValidity()) return;
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Sending…";
        }
        if (status) {
          status.classList.remove("is-error");
          status.textContent = "Sending your request through the current form provider…";
        }
        window.dispatchEvent(new CustomEvent("gdlogi:generate_lead", { detail: { source: "homepage-quick-form" } }));
      };

      onInput = () => {
        if (!status || form.querySelectorAll(":invalid").length > 0) return;
        status.classList.remove("is-error");
        status.textContent = "If the form does not complete, email zoe@gdlogi.com.";
      };

      onPageShow = () => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Get a Shipping Quote";
        }
      };

      form.addEventListener("invalid", onInvalid, true);
      form.addEventListener("input", onInput);
      form.addEventListener("submit", onSubmit);
      window.addEventListener("pageshow", onPageShow);
    }

    return () => {
      menuToggle?.removeEventListener("click", onMenuToggle);
      navLinks.forEach((link) => link.removeEventListener("click", onNavLinkClick));
      navTriggerHandlers.forEach(([trigger, handler]) => trigger?.removeEventListener("click", handler));
      document.removeEventListener("click", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
      if (form) {
        if (onInvalid) form.removeEventListener("invalid", onInvalid, true);
        if (onInput) form.removeEventListener("input", onInput);
        if (onSubmit) form.removeEventListener("submit", onSubmit);
      }
      if (onPageShow) window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
