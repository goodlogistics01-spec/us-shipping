import MarketingPage, { Breadcrumbs, JsonLd } from "../components/MarketingPage";
import { company, createPageMetadata } from "../site-data";

export const metadata = createPageMetadata({
  title: "About GOOD LOGISTICS | China-to-USA Coordination",
  description: "Meet GOOD LOGISTICS, a Shenzhen-based team coordinating supplier pickup, consolidation, cargo preparation, freight, customs-broker handoffs and final delivery planning.",
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
          <h1>One Logistics Team for Your Shipment from China</h1>
          <p className="marketing-lead">GOOD LOGISTICS brings supplier pickup, China-side handling, freight, broker handoffs and U.S. delivery into one shipment plan for importers, multi-supplier buyers, brands and FBA sellers.</p>
          <div className="marketing-actions">
            <a className="marketing-button marketing-button-primary" href="/quote/">Get a Shipping Quote</a>
            <a className="marketing-button marketing-button-secondary" href={`${company.whatsappHref}?text=Hello%20Zoe%2C%20I%27d%20like%20to%20discuss%20a%20shipment%20from%20China.`}>Chat with Zoe</a>
          </div>
        </div>
      </section>
      <section className="marketing-section">
        <div className="marketing-container marketing-content-narrow">
          <p className="marketing-eyebrow">Before Freight Moves</p>
          <h2>The shipment starts before the freight booking</h2>
          <p>When cargo comes from one or more suppliers, goods may need pickup, receiving records, consolidation, temporary storage, labeling, repacking or kitting before export. GOOD LOGISTICS brings those requirements into the same shipment plan as ocean, air or express freight, customs-broker coordination and final-delivery planning.</p>
        </div>
      </section>
      <section className="marketing-section marketing-soft-section">
        <div className="marketing-container">
          <p className="marketing-eyebrow">Coordinated Scope</p>
          <h2>What one shipment plan can include</h2>
          <div className="marketing-card-grid">
            <article className="marketing-content-card">
              <h2>China origin operations</h2>
              <p>Pickup from confirmed supplier locations, receiving checks, multi-supplier consolidation, warehousing options, labeling, repacking, kitting and light assembly.</p>
              <a className="marketing-text-link" href="/services/supplier-consolidation/">Review China operations →</a>
            </article>
            <article className="marketing-content-card">
              <h2>International freight</h2>
              <p>FCL and LCL ocean freight, air freight, international express and scope-defined door-to-door options selected around the actual cargo.</p>
              <a className="marketing-text-link" href="/services/sea-freight-china-to-usa/">Compare freight modes →</a>
            </article>
            <article className="marketing-content-card">
              <h2>U.S. delivery handoffs</h2>
              <p>Customs-clearance coordination through licensed brokers or partners, followed by partner-carrier delivery planning for the confirmed mainland, Hawaii, Alaska or Puerto Rico address.</p>
              <a className="marketing-text-link" href="/#destinations">Review destinations →</a>
            </article>
          </div>
        </div>
      </section>
      <section className="marketing-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Clear Responsibilities</p>
            <h2>Know who handles each stage before booking</h2>
            <p>The quotation identifies which stages GOOD LOGISTICS arranges and which are performed by carriers, licensed customs brokers or local partners.</p>
            <p>It also identifies the agreed scope, known exclusions and any condition still requiring confirmation.</p>
          </div>
          <div>
            <p className="marketing-eyebrow">How to Start</p>
            <h2>Move from cargo data to a defined scope</h2>
            <ol className="marketing-step-list">
              <li><span>01</span><p>Send supplier locations, cargo details, packed dimensions, weight and destination.</p></li>
              <li><span>02</span><p>Confirm the pickup, receiving, preparation, freight and delivery stages needed.</p></li>
              <li><span>03</span><p>Review the quotation scope, exclusions and destination requirements.</p></li>
              <li><span>04</span><p>Approve the shipment-specific plan before pickup or cargo handoff.</p></li>
            </ol>
          </div>
        </div>
      </section>
      <section className="marketing-section marketing-soft-section">
        <div className="marketing-container marketing-two-column">
          <div className="marketing-note-card">
            <p className="marketing-eyebrow">Checks &amp; Inspection</p>
            <h2>Receiving checks are not product certification</h2>
            <p>Receiving checks can cover package quantity, outer-carton condition, labels and visible damage against customer-provided references.</p>
            <p>Product-quality inspection, sampling criteria and reporting require a separately agreed scope. No laboratory testing, AQL qualification or automatic 100% inspection is claimed.</p>
          </div>
          <div className="marketing-note-card">
            <p className="marketing-eyebrow">Public Company Details</p>
            <h2>GOOD LOGISTICS</h2>
            <p>{company.legalName}</p>
            <p lang="zh-CN">{company.chineseName}</p>
            <p>Shenzhen, China</p>
          </div>
        </div>
      </section>
      <section className="marketing-section">
        <div className="marketing-container marketing-person-card">
          <picture>
            <source srcSet="/good-shipping-homepage/assets/authors/zoe-zhou-headshot-640.avif" type="image/avif" />
            <img src="/good-shipping-homepage/assets/authors/zoe-zhou-headshot-240.jpg" alt="Zoe Zhou, Director of International Logistics at GOOD LOGISTICS" width="240" height="339" loading="lazy" decoding="async" />
          </picture>
          <div>
            <p className="marketing-eyebrow">Your Public Contact</p>
            <h2>Plan the shipment with Zoe Zhou</h2>
            <p>Zoe Zhou, Director of International Logistics, is the public contact for shipment planning. Send the supplier, cargo and delivery details you have. Zoe will identify what is still needed for a useful quote.</p>
            <div className="marketing-actions">
              <a className="marketing-button marketing-button-primary" href="/quote/">Get a Shipping Quote</a>
              <a className="marketing-text-link" href="/about/zoe-zhou/">Meet Zoe Zhou →</a>
            </div>
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
