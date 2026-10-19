"use client";

import { useEffect, useRef, useState } from "react";

const services = [
  ["Ocean Freight", "/services/sea-freight-china-to-usa/"],
  ["Air Freight", "/services/air-freight-china-to-usa/"],
  ["DDP Door-to-Door", "/services/ddp-shipping-china-to-usa/"],
  ["Amazon FBA Shipping", "/services/amazon-fba-shipping/"],
  ["Oversized Cargo", "/services/oversized-cargo-shipping/"],
  ["Express Shipping", "/quote/?service=express-shipping"]
];

const solutions = [
  ["China Pickup", "/quote/?solution=china-pickup"],
  ["Cargo Consolidation", "/services/supplier-consolidation/"],
  ["Customs Clearance", "/quote/?solution=customs-clearance"],
  ["Warehousing", "/quote/?solution=warehousing"],
  ["Final Delivery", "/quote/?solution=final-delivery"]
];

const destinations = [
  ["USA", "/#destinations"],
  ["Mexico", "https://gdlogi.com/", true],
  ["Canada", "https://gdlogi.com/", true],
  ["UK & Europe", "https://gdlogi.com/", true],
  ["Hawaii", "/destinations/hawaii/"],
  ["Alaska", "/destinations/alaska/"],
  ["Puerto Rico", "/destinations/puerto-rico/"]
];

const directLinks = [
  ["Industries", "/#industries"],
  ["Case Studies", "/#cases"],
  ["About Us", "/about/"],
  ["Resources", "/resources/"]
];

function Dropdown({ label, items, openMenu, setOpenMenu, closeAll }) {
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
      <div className="marketing-dropdown">
        {items.map(([itemLabel, href, external]) => (
          <a
            key={`${itemLabel}-${href}`}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener" : undefined}
            onClick={closeAll}
          >
            <span>{itemLabel}</span>{external && <small>Global site</small>}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState("");
  const headerRef = useRef(null);

  const closeAll = () => {
    setOpen(false);
    setOpenMenu("");
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeAll();
    };
    const onPointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) setOpenMenu("");
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <header className="marketing-header" ref={headerRef}>
      <div className="marketing-container marketing-nav">
        <a className="marketing-brand" href="/" aria-label="Good Logistics Co., Ltd. home">
          <img
            src="/good-shipping-homepage/assets/good-logistics-logo.png"
            alt="Good Logistics Co., Ltd."
            width="520"
            height="270"
          />
        </a>
        <button
          className="marketing-menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="marketing-navigation"
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
          <Dropdown label="Services" items={services} openMenu={openMenu} setOpenMenu={setOpenMenu} closeAll={closeAll} />
          <Dropdown label="Solutions" items={solutions} openMenu={openMenu} setOpenMenu={setOpenMenu} closeAll={closeAll} />
          <Dropdown label="Destinations" items={destinations} openMenu={openMenu} setOpenMenu={setOpenMenu} closeAll={closeAll} />
          {directLinks.map(([label, href]) => (
            <a className="marketing-nav-link" key={href} href={href} onClick={closeAll}>{label}</a>
          ))}
          <a className="marketing-button marketing-button-primary marketing-mobile-quote" href="/quote/" onClick={closeAll}>
            Get a Shipping Quote
          </a>
        </nav>
        <a className="marketing-button marketing-button-primary marketing-desktop-quote" href="/quote/">
          Get a Shipping Quote
        </a>
      </div>
    </header>
  );
}
