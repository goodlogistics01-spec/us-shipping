import { company } from "../site-data";

export default function SiteFooter() {
  return (
    <footer className="marketing-footer">
      <div className="marketing-container marketing-footer-grid">
        <div>
          <img
            className="marketing-footer-logo"
            src="/good-shipping-homepage/assets/good-logistics-logo.png"
            alt="GOOD LOGISTICS"
            width="180"
            height="94"
            loading="lazy"
          />
          <p>China-side cargo operations and international delivery coordination from suppliers to the confirmed final destination.</p>
          <p>{company.legalName}<br />{company.chineseName}</p>
        </div>
        <div>
          <h2>Services</h2>
          <a href="/services/supplier-consolidation/">Pickup &amp; Consolidation</a>
          <a href="/services/warehousing-inventory-coordination/">Warehousing &amp; Inventory</a>
          <a href="/services/amazon-fba-shipping/">FBA Prep &amp; Shipping</a>
          <a href="/services/kitting-light-assembly/">Kitting &amp; Light Assembly</a>
          <a href="/services/cargo-inspection-receiving-checks/">Inspection &amp; Receiving</a>
        </div>
        <div>
          <h2>Freight &amp; Destinations</h2>
          <a href="/services/sea-freight-china-to-usa/">Sea Freight</a>
          <a href="/services/air-freight-china-to-usa/">Air Freight</a>
          <a href="/services/ddp-shipping-china-to-usa/">DDP Door-to-Door</a>
          <a href="/destinations/hawaii/">Hawaii</a>
          <a href="/destinations/alaska/">Alaska</a>
          <a href="/destinations/puerto-rico/">Puerto Rico</a>
        </div>
        <div>
          <h2>Company</h2>
          <a href="/about/">About Us</a>
          <a href="/about/zoe-zhou/">Zoe Zhou</a>
          <a href="/contact/">Contact</a>
          <a href="/resources/">Resources</a>
          <a href="/quote/">Request a Shipping &amp; Prep Quote</a>
          <a href={`mailto:${company.email}`}>Email {company.email}</a>
          <a href={company.whatsappHref}>WhatsApp {company.phoneDisplay}</a>
        </div>
      </div>
      <div className="marketing-container marketing-footer-bottom">
        <span>© 2026 {company.name}</span>
        <span>
          <a href="/privacy-policy/">Privacy Policy</a>
          <a href="/terms-of-use/">Terms of Use</a>
        </span>
      </div>
    </footer>
  );
}
