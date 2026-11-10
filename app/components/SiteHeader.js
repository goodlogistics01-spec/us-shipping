"use client";

import { useEffect, useRef, useState } from "react";

const serviceGroups = [
  {
    label: "China Operations",
    items: [
      ["Pickup & Consolidation", "/services/supplier-consolidation/"],
      ["Warehousing & Inventory", "/services/warehousing-inventory-coordination/"],
      ["FBA Prep & Repacking", "/services/amazon-fba-shipping/"],
      ["Kitting & Light Assembly", "/services/kitting-light-assembly/"],
      ["Inspection & Receiving Checks", "/services/cargo-inspection-receiving-checks/"]
    ]
  },
  {
    label: "International Freight & Delivery",
    items: [
      ["Ocean Freight", "/services/sea-freight-china-to-usa/"],
      ["Air Freight", "/services/air-freight-china-to-usa/"],
      ["DDP Door-to-Door", "/services/ddp-shipping-china-to-usa/"],
      ["Amazon FBA Delivery", "/services/amazon-fba-shipping/"],
      ["Oversized Cargo", "/services/oversized-cargo-shipping/"]
    ]
  }
];

const destinations = [
  ["Mainland USA", "/#destinations"],
  ["Hawaii", "/destinations/hawaii/"],
  ["Alaska", "/destinations/alaska/"],
  ["Puerto Rico", "/destinations/puerto-rico/"]
];

const directLinks = [
  ["Case Study", "/#case-study"],
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

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState("");
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);

  const closeAll = () => {
    setOpen(false);
    setOpenMenu("");
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && (open || openMenu)) {
        closeAll();
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
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
          <Dropdown label="Destinations" items={destinations} openMenu={openMenu} setOpenMenu={setOpenMenu} closeAll={closeAll} />
          {directLinks.map(([label, href]) => (
            <a className="marketing-nav-link" key={href} href={href} onClick={closeAll}>{label}</a>
          ))}
          <a className="marketing-button marketing-button-primary marketing-mobile-quote" href="/quote/" onClick={closeAll}>
            Request a Quote
          </a>
        </nav>
        <a className="marketing-button marketing-button-primary marketing-desktop-quote" href="/quote/">
          Request a Quote
        </a>
      </div>
    </header>
  );
}
