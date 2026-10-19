import { company } from "../site-data";

export default function SiteFooter() {
  return (
    <footer className="marketing-footer">
      <div className="marketing-container marketing-footer-grid">
        <div>
          <img
            className="marketing-footer-logo"
            src="/good-shipping-homepage/assets/good-logistics-logo.png"
            alt="Good Logistics Co., Ltd."
            width="180"
            height="94"
            loading="lazy"
          />
          <p>Freight forwarding from China to the United States with one coordinated shipping plan.</p>
        </div>
        <div>
          <h2>Services</h2>
          <a href="/services/sea-freight-china-to-usa/">Sea Freight</a>
          <a href="/services/air-freight-china-to-usa/">Air Freight</a>
          <a href="/services/ddp-shipping-china-to-usa/">DDP Shipping</a>
          <a href="/services/supplier-consolidation/">Supplier Consolidation</a>
        </div>
        <div>
          <h2>Destinations</h2>
          <a href="/destinations/hawaii/">Hawaii</a>
          <a href="/destinations/alaska/">Alaska</a>
          <a href="/destinations/puerto-rico/">Puerto Rico</a>
          <a href="/resources/">Resources</a>
        </div>
        <div>
          <h2>Company</h2>
          <a href="/about/">About Us</a>
          <a href="/about/zoe-zhou/">Zoe Zhou</a>
          <a href="/contact/">Contact</a>
          <a href="/quote/">Get a Shipping Quote</a>
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
