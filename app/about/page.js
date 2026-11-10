import MarketingPage, { Breadcrumbs, JsonLd } from "../components/MarketingPage";
import { company, createPageMetadata } from "../site-data";

export const metadata = createPageMetadata({
  title: "About GOOD LOGISTICS | China Operations & USA Delivery",
  description: "Learn how GOOD LOGISTICS coordinates China-side cargo operations with international freight and final delivery to the United States.",
  path: "/about/"
});

export default function AboutPage() {
  return (
    <MarketingPage>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", name: `About ${company.name}`, url: `${company.website}/about/`, about: { "@type": "Organization", name: company.name, url: company.website } }} />
      <section className="marketing-page-hero">
        <div className="marketing-container marketing-content-narrow">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <p className="marketing-eyebrow">About GOOD LOGISTICS</p>
          <h1>From Supplier Handoffs in China to Final Delivery</h1>
          <p className="marketing-lead">GOOD LOGISTICS coordinates China-side cargo operations with international freight, customs-clearance handoffs and delivery to the confirmed U.S. destination.</p>
        </div>
      </section>
      <section className="marketing-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <h2>What the team coordinates</h2>
            <ul className="marketing-check-list">
              <li>Supplier pickup and multi-supplier consolidation in China</li>
              <li>Receiving checks, temporary storage and inventory coordination</li>
              <li>FNSKU labeling, repacking, polybagging and confirmed preparation work</li>
              <li>Kitting, accessories, inserts and simple assembly to agreed instructions</li>
              <li>Separately scoped product inspection when requested</li>
              <li>FCL, LCL, air and scope-defined DDP shipping plans</li>
              <li>Amazon FBA and commercial delivery coordination</li>
              <li>Oversized and difficult cargo planning</li>
              <li>Delivery planning for mainland USA, Hawaii, Alaska and Puerto Rico</li>
            </ul>
          </div>
          <div className="marketing-note-card">
            <p className="marketing-eyebrow">Public Company Names</p>
            <h2>GOOD LOGISTICS</h2>
            <p>{company.legalName}</p>
            <p lang="zh-CN">{company.chineseName}</p>
            <p>Shenzhen, China</p>
          </div>
          <div className="marketing-note-card">
            <p className="marketing-eyebrow">Defined Shipment Scope</p>
            <h2>Responsibilities are reviewed before booking</h2>
            <p>Each quotation should identify the agreed pickup, freight, customs-broker coordination and delivery stages, together with known exclusions.</p>
            <p>Special cargo, regulated products and remote addresses require shipment-specific review.</p>
          </div>
        </div>
      </section>
      <section className="marketing-cta">
        <div className="marketing-container marketing-cta-inner">
          <div><h2>Discuss your next China to USA shipment</h2><p>Share your cargo requirements for a route and scope review.</p></div>
          <a className="marketing-button marketing-button-primary" href="/quote/">Request a Shipping &amp; Prep Quote</a>
        </div>
      </section>
    </MarketingPage>
  );
}
