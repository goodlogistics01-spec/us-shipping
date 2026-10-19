import MarketingPage, { Breadcrumbs, JsonLd } from "../components/MarketingPage";
import { company, createPageMetadata } from "../site-data";

export const metadata = createPageMetadata({
  title: "About Good Logistics | China to USA Freight Forwarder",
  description: "Learn how Good Logistics coordinates pickup, consolidation, freight and final delivery for China to USA shipments.",
  path: "/about/"
});

export default function AboutPage() {
  return (
    <MarketingPage>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", name: `About ${company.name}`, url: `${company.website}/about/`, about: { "@type": "Organization", name: company.name, url: company.website } }} />
      <section className="marketing-page-hero">
        <div className="marketing-container marketing-content-narrow">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <p className="marketing-eyebrow">About Good Logistics</p>
          <h1>One Coordinated Team for China to USA Freight</h1>
          <p className="marketing-lead">Good Logistics Co., Ltd. helps U.S. importers organize supplier pickup, consolidation, international freight and final delivery under a clearly defined shipment plan.</p>
        </div>
      </section>
      <section className="marketing-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <h2>What the team coordinates</h2>
            <ul className="marketing-check-list">
              <li>Supplier pickup and multi-supplier consolidation in China</li>
              <li>FCL, LCL, air and scope-defined DDP shipping plans</li>
              <li>Amazon FBA and commercial delivery coordination</li>
              <li>Oversized and difficult cargo planning</li>
              <li>Delivery planning for mainland USA, Hawaii, Alaska and Puerto Rico</li>
            </ul>
          </div>
          <div className="marketing-note-card">
            <p className="marketing-eyebrow">Qualification Review</p>
            <h2>Registration details require final confirmation</h2>
            <p>The project contains company-provided qualification references, but the original documents, issuing authorities, public-safe copies and exact English names still require company confirmation before publication.</p>
            <p>No team-size, shipment-volume, customer-count or on-time-rate claims are published on this page.</p>
          </div>
        </div>
      </section>
      <section className="marketing-cta">
        <div className="marketing-container marketing-cta-inner">
          <div><h2>Discuss your next China to USA shipment</h2><p>Share your cargo requirements for a route and scope review.</p></div>
          <a className="marketing-button marketing-button-primary" href="/quote/">Get a Shipping Quote</a>
        </div>
      </section>
    </MarketingPage>
  );
}
