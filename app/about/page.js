import MarketingPage, { JsonLd, PageHero } from "../components/MarketingPage";
import { company, createPageMetadata } from "../site-data";

export const metadata = createPageMetadata({
  title: "About GOOD LOGISTICS | Freight & China Cargo Operations",
  description: "Meet the Shenzhen-based GOOD LOGISTICS team coordinating China-side cargo operations and international freight to the USA and other major markets.",
  path: "/about/"
});

export default function AboutPage() {
  return (
    <MarketingPage>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", name: `About ${company.name}`, url: `${company.website}/about/`, about: { "@type": "Organization", name: company.name, url: company.website } }} />
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="About GOOD LOGISTICS"
        title="One Team for Your Cargo in China and Its International Journey"
        lead="GOOD LOGISTICS coordinates supplier pickup, cargo preparation and freight to the USA, Canada, the UK, Europe, Australia and New Zealand from Shenzhen, China."
      >
        <div className="marketing-actions">
          <a className="marketing-button marketing-button-primary" href="/quote/">Get a Shipping Quote</a>
          <a className="marketing-button marketing-button-secondary" href={`${company.whatsappHref}?text=Hello%20Zoe%2C%20I%27d%20like%20to%20discuss%20a%20shipment%20from%20China.`}>Chat with Zoe</a>
        </div>
      </PageHero>

      <section className="marketing-section">
        <div className="marketing-container marketing-two-column marketing-operation-feature-grid">
          <div>
            <p className="marketing-eyebrow">What We Coordinate</p>
            <h2>Origin work and freight in one shipment plan</h2>
            <p>We can arrange pickup from confirmed supplier locations, receiving records, consolidation, storage options, labeling, repacking, kitting and light assembly before the cargo moves by ocean, air or express.</p>
            <p>Customs clearance and final delivery are arranged with the appropriate brokers, carriers and local partners for the confirmed destination.</p>
          </div>
          <figure className="marketing-service-media">
            <picture>
              <source type="image/avif" srcSet="/good-shipping-homepage/assets/operations/consolidation-staging-480.avif 480w, /good-shipping-homepage/assets/operations/consolidation-staging-800.avif 800w, /good-shipping-homepage/assets/operations/consolidation-staging-1000.avif 1000w" sizes="(max-width: 700px) 100vw, 48vw" />
              <source type="image/webp" srcSet="/good-shipping-homepage/assets/operations/consolidation-staging-480.webp 480w, /good-shipping-homepage/assets/operations/consolidation-staging-800.webp 800w, /good-shipping-homepage/assets/operations/consolidation-staging-1000.webp 1000w" sizes="(max-width: 700px) 100vw, 48vw" />
              <img src="/good-shipping-homepage/assets/operations/consolidation-staging-1000.jpg" alt="Cartons staged for consolidation and shipment planning" width="1000" height="750" loading="lazy" decoding="async" />
            </picture>
            <figcaption>Cargo staged so quantities and release instructions can be organized before the next shipment step.</figcaption>
          </figure>
        </div>
      </section>

      <section className="marketing-section marketing-soft-section">
        <div className="marketing-container">
          <p className="marketing-eyebrow">Core Capabilities</p>
          <h2>Choose only the services your cargo needs</h2>
          <div className="marketing-card-grid">
            <article className="marketing-content-card">
              <h3>China origin operations</h3>
              <p>Supplier pickup, receiving checks, consolidation, storage options, labeling, repacking, kitting and light assembly.</p>
              <a className="marketing-text-link" href="/services/supplier-consolidation/">View China operations →</a>
            </article>
            <article className="marketing-content-card">
              <h3>International freight</h3>
              <p>FCL and LCL ocean freight, air freight, international express and shipment-specific door delivery options.</p>
              <a className="marketing-text-link" href="/services/sea-freight-china-to-usa/">View freight services →</a>
            </article>
            <article className="marketing-content-card">
              <h3>Complex cargo and destinations</h3>
              <p>Planning around packed size, weight, unloading needs and special U.S. destinations such as Hawaii, Alaska and Puerto Rico.</p>
              <a className="marketing-text-link" href="/services/oversized-cargo-shipping/">View oversized cargo support →</a>
            </article>
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Receiving &amp; Inspection</p>
            <h2>Two different levels of checking</h2>
            <p>Receiving checks can cover package quantity, outer-carton condition, labels and visible damage against your references.</p>
            <p>Product-quality inspection, sampling and reporting are separate services with the checklist agreed before work starts.</p>
          </div>
          <div className="marketing-note-card">
            <p className="marketing-eyebrow">Company Details</p>
            <h2>GOOD LOGISTICS</h2>
            <p>{company.legalName}</p>
            <p lang="zh-CN">{company.chineseName}</p>
            <p>Shenzhen, China</p>
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-soft-section">
        <div className="marketing-container marketing-person-card">
          <picture>
            <source srcSet="/good-shipping-homepage/assets/authors/zoe-zhou-headshot-640.avif" type="image/avif" />
            <img src="/good-shipping-homepage/assets/authors/zoe-zhou-headshot-240.jpg" alt="Zoe Zhou, Director of International Logistics at GOOD LOGISTICS" width="240" height="339" loading="lazy" decoding="async" />
          </picture>
          <div>
            <p className="marketing-eyebrow">Your Logistics Contact</p>
            <h2>Plan your shipment with Zoe Zhou</h2>
            <p>Share the supplier locations, product, packed size or weight and delivery address you have. Zoe will help identify the right origin work and freight options.</p>
            <div className="marketing-actions">
              <a className="marketing-button marketing-button-primary" href="/quote/">Get a Shipping Quote</a>
              <a className="marketing-text-link" href="/about/zoe-zhou/">Meet Zoe Zhou →</a>
            </div>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
