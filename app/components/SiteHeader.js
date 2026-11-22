"use client";

import { useEffect, useRef, useState } from "react";
import { destinationGroups, directLinks, serviceGroups } from "../navigation-data";
import { company } from "../site-data";

function GroupedDropdown({ label, groups, openMenu, setOpenMenu, closeAll }) {
  const isOpen = openMenu === label;
  return (
    <div className="marketing-nav-item" data-open={isOpen ? "true" : "false"}>
      <button
        className="marketing-nav-trigger"
        type="button"
        aria-expanded={isOpen}
        onClick={() => setOpenMenu(isOpen ? "" : label)}
      >
        {label}
        <svg viewBox="0 0 12 8" aria-hidden="true"><path d="m1 1 5 5 5-5" /></svg>
      </button>
      <div className="marketing-dropdown marketing-dropdown-grouped">
        {groups.map((group) => (
          <section className="marketing-dropdown-group" key={group.label} aria-label={group.label}>
            <p>{group.label}</p>
            {group.items.map(([itemLabel, href]) => (
              <a key={`${itemLabel}-${href}`} href={href} onClick={closeAll}>{itemLabel}</a>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

export default function SiteHeader({ context = "site" }) {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState("");
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);

  const closeAll = () => {
    setOpen(false);
    setOpenMenu("");
  };

  const quoteLocation = context === "home"
    ? { desktop: "home_header_desktop", mobile: "home_header_mobile" }
    : {};

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && (open || openMenu)) {
        const focusTarget = open
          ? menuButtonRef.current
          : headerRef.current?.querySelector(
              '.marketing-nav-item[data-open="true"] > .marketing-nav-trigger'
            );
        closeAll();
        window.requestAnimationFrame(() => focusTarget?.focus());
      }
    };
    const onPointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) setOpenMenu("");
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    document.body.classList.toggle("marketing-menu-lock", open);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      document.body.classList.remove("marketing-menu-lock");
    };
  }, [open, openMenu]);

  return (
    <header className="marketing-header" ref={headerRef}>
      <div className="marketing-container marketing-nav">
        <a className="marketing-brand" href="/" aria-label="GOOD LOGISTICS home">
          <img
            src="/good-shipping-homepage/assets/good-logistics-logo.png"
            alt="GOOD LOGISTICS"
            width="520"
            height="270"
          />
        </a>
        <button
          ref={menuButtonRef}
          className="marketing-menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="marketing-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => {
            setOpen((value) => !value);
            if (open) setOpenMenu("");
          }}
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="marketing-menu-bars" aria-hidden="true"><i /><i /><i /></span>
        </button>
        <nav
          id="marketing-navigation"
          className="marketing-links"
          data-open={open ? "true" : "false"}
          aria-label="Primary navigation"
        >
          <GroupedDropdown label="Services" groups={serviceGroups} openMenu={openMenu} setOpenMenu={setOpenMenu} closeAll={closeAll} />
          <GroupedDropdown label="Destinations" groups={destinationGroups} openMenu={openMenu} setOpenMenu={setOpenMenu} closeAll={closeAll} />
          {directLinks.map(([label, href]) => (
            <a className="marketing-nav-link" key={href} href={href} onClick={closeAll}>{label}</a>
          ))}
          <div className="marketing-mobile-contact" aria-label="Direct contact">
            <a href={company.whatsappHref} data-contact-event="whatsapp_click" onClick={closeAll}>WhatsApp {company.phoneDisplay}</a>
            <a href={`mailto:${company.email}`} data-contact-event="email_click" onClick={closeAll}>Email</a>
          </div>
          <a
            className="marketing-button marketing-button-primary marketing-mobile-quote"
            href="/quote/"
            data-quote-location={quoteLocation.mobile}
            onClick={closeAll}
          >
            Get a Quote
          </a>
        </nav>
        <a
          className="marketing-button marketing-button-primary marketing-desktop-quote"
          href="/quote/"
          data-quote-location={quoteLocation.desktop}
        >
          Get a Quote
        </a>
      </div>
    </header>
  );
}
