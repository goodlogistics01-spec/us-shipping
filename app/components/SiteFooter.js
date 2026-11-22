import { company } from "../site-data";
import { serviceGroups } from "../navigation-data";

export default function SiteFooter() {
  return (
    <footer className="marketing-footer">
      <div className="marketing-container marketing-footer-grid">
        <div className="marketing-footer-brand">
          <img
            className="marketing-footer-logo"
            src="/good-shipping-homepage/assets/good-logistics-logo.png"
            alt="GOOD LOGISTICS"
            width="180"
            height="94"
            loading="lazy"
          />
          <p>Freight and China-side cargo coordination from supplier pickup to the agreed destination.</p>
          <p>{company.legalName}<br />{company.chineseName}</p>
        </div>
        <div>
          <h2>{serviceGroups[0].label}</h2>
          {serviceGroups[0].items.slice(0, 6).map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </div>
        <div>
          <h2>{serviceGroups[1].label}</h2>
          {serviceGroups[1].items.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </div>
        <div>
          <h2>Destinations</h2>
          <a href="/#destinations">USA, Canada, UK &amp; Europe</a>
          <a href="/#destinations">Australia &amp; New Zealand</a>
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
          <a href="/quote/">Get a Quote</a>
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
