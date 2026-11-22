import MarketingPage, { Breadcrumbs, JsonLd } from "./MarketingPage";
import QuoteForm from "./QuoteForm";
import { company } from "../site-data";

const serviceStrip = [
  "FCL & LCL options",
  "Supplier pickup & consolidation",
  "Customs-broker coordination",
  "Delivery planned to the confirmed address"
];

const comparisonRows = [
  ["Best fit", "Cargo that fills a container or benefits from dedicated space", "Commercial cargo that does not require a full container"],
  ["Pricing basis", "Container, route and included origin/destination services", "Volume, weight, handling and shared-container services"],
  ["Cargo handling", "Fewer transfers after loading", "Consolidation and deconsolidation are part of the movement"],
  ["Planning point", "Container loading, equipment and delivery access", "Cargo compatibility, cutoff and release timing"]
];

function ResponsiveOperationImage({ base, widths, fallback, width, height, alt }) {
  const sizes = "(max-width: 760px) 100vw, 50vw";
  return (
    <picture>
      <source type="image/avif" srcSet={widths.map((item) => `${base}-${item}.avif ${item}w`).join(", ")} sizes={sizes} />
      <source type="image/webp" srcSet={widths.map((item) => `${base}-${item}.webp ${item}w`).join(", ")} sizes={sizes} />
      <img src={`${base}-${fallback}.jpg`} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
    </picture>
  );
}

export default function OceanFreightPage({ service, schema }) {
  return (
    <MarketingPage>
      <JsonLd data={schema} />

      <section className="ocean-hero">
        <div className="marketing-container ocean-hero-grid">
          <div className="ocean-hero-copy">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/#services" }, { label: "Sea Freight" }]} />
            <p className="ocean-section-label">China to USA ocean freight</p>
            <h1>Sea Freight from China to the USA</h1>
            <p>Plan FCL or LCL freight with supplier pickup, consolidation, customs-broker coordination and delivery to the agreed U.S. address.</p>
            <div className="ocean-hero-actions">
              <a className="marketing-button marketing-button-primary" href="#quote-form" data-quote-location="ocean_hero">Get a Shipping Quote</a>
              <a className="marketing-button ocean-button-light" href={company.whatsappHref} data-contact-event="whatsapp_click">Chat with Zoe on WhatsApp</a>
            </div>
          </div>
          <picture className="ocean-hero-picture" aria-hidden="true">
            <source media="(max-width: 760px)" type="image/avif" srcSet="/good-shipping-homepage/assets/brand/container-ship-hero-mobile-640.avif 640w, /good-shipping-homepage/assets/brand/container-ship-hero-mobile-960.avif 960w" sizes="100vw" />
            <source media="(max-width: 760px)" type="image/webp" srcSet="/good-shipping-homepage/assets/brand/container-ship-hero-mobile-640.webp 640w, /good-shipping-homepage/assets/brand/container-ship-hero-mobile-960.webp 960w" sizes="100vw" />
            <source type="image/avif" srcSet="/good-shipping-homepage/assets/brand/container-ship-hero-desktop-960.avif 960w, /good-shipping-homepage/assets/brand/container-ship-hero-desktop-1600.avif 1600w, /good-shipping-homepage/assets/brand/container-ship-hero-desktop-2400.avif 2400w" sizes="(max-width: 1100px) 100vw, 55vw" />
            <source type="image/webp" srcSet="/good-shipping-homepage/assets/brand/container-ship-hero-desktop-960.webp 960w, /good-shipping-homepage/assets/brand/container-ship-hero-desktop-1600.webp 1600w, /good-shipping-homepage/assets/brand/container-ship-hero-desktop-2400.webp 2400w" sizes="(max-width: 1100px) 100vw, 55vw" />
            <img src="/good-shipping-homepage/assets/brand/container-ship-hero-desktop-1600.jpg" alt="Container ship crossing calm coastal water." width="1600" height="900" fetchPriority="high" decoding="async" />
          </picture>
        </div>
      </section>

      <aside className="ocean-service-strip" aria-label="Sea freight service scope">
        <ul className="marketing-container">
          {serviceStrip.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </aside>

      <section className="ocean-section" id="fcl-lcl" aria-labelledby="ocean-options-title">
        <div className="marketing-container">
          <div className="ocean-heading-row">
            <div>
              <p className="ocean-section-label">Choose the right container plan</p>
              <h2 id="ocean-options-title">FCL or LCL, Based on the Cargo</h2>
            </div>
            <p>We compare shipment size, cargo handling, supplier locations and the complete delivery scope—not only the ocean leg.</p>
          </div>
          <div className="ocean-option-cards">
            <article>
              <span>FCL</span>
              <h3>Full Container Load</h3>
              <p>Dedicated container space for cargo that fills a container or benefits from fewer transfers.</p>
            </article>
            <article>
              <span>LCL</span>
              <h3>Less than Container Load</h3>
              <p>Shared-container planning for commercial cargo that does not require a full container.</p>
            </article>
          </div>
          <div className="ocean-comparison-scroll" tabIndex="0" aria-label="Scrollable FCL and LCL comparison">
            <table className="ocean-comparison-table">
              <caption className="sr-only">Comparison of full container load and less than container load sea freight</caption>
              <thead><tr><th scope="col">Planning factor</th><th scope="col">FCL</th><th scope="col">LCL</th></tr></thead>
              <tbody>
                {comparisonRows.map(([factor, fcl, lcl]) => (
                  <tr key={factor}><th scope="row">{factor}</th><td>{fcl}</td><td>{lcl}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="ocean-section ocean-soft-section" aria-labelledby="ocean-scope-title">
        <div className="marketing-container ocean-scope-grid">
          <div>
            <p className="ocean-section-label">One shipment plan</p>
            <h2 id="ocean-scope-title">From Supplier Pickup to Final Delivery</h2>
            <p>Choose only the services your shipment needs. The quotation sets out the included origin, freight, customs and delivery responsibilities.</p>
            <a className="marketing-text-link" href="/services/supplier-consolidation/">Explore supplier pickup and consolidation</a>
          </div>
          <ol className="ocean-scope-steps">
            <li><span>01</span><div><h3>Share the cargo</h3><p>Product, packaging, dimensions, weight, supplier locations and cargo-ready dates.</p></div></li>
            <li><span>02</span><div><h3>Compare the plan</h3><p>FCL or LCL, pickup needs, customs responsibilities and final-delivery conditions.</p></div></li>
            <li><span>03</span><div><h3>Receive clear updates</h3><p>Progress at the agreed pickup, loading, departure, release and delivery milestones.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="ocean-section" aria-labelledby="ocean-evidence-title">
        <div className="marketing-container">
          <div className="ocean-heading-row">
            <div>
              <p className="ocean-section-label">Selected operations</p>
              <h2 id="ocean-evidence-title">Cargo Prepared for Container Loading</h2>
            </div>
            <p>Staging and loading records help align package groups, release instructions and container use before departure.</p>
          </div>
          <div className="ocean-evidence-grid">
            <figure>
              <ResponsiveOperationImage base="/good-shipping-homepage/assets/operations/consolidation-staging" widths={[480, 800, 1000]} fallback={1000} width={1000} height={750} alt="Mixed crates and packaged cargo staged before a planned shipment release." />
              <figcaption>Cartons can be grouped by the agreed shipping plan before release.</figcaption>
            </figure>
            <figure>
              <ResponsiveOperationImage base="/good-shipping-homepage/assets/operations/fcl-loaded-cartons" widths={[480, 800, 1000]} fallback={1000} width={1000} height={1333} alt="Commercial cartons arranged inside a shipping container during loading." />
              <figcaption>Carton placement is recorded during container loading.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="ocean-section ocean-navy-section" aria-labelledby="ocean-planning-title">
        <div className="marketing-container ocean-planning-grid">
          <div>
            <p className="ocean-section-label">Quote inputs</p>
            <h2 id="ocean-planning-title">What Shapes the Price and Schedule</h2>
            <p>Sailing and delivery timing are quoted for the actual route, cargo and service scope.</p>
          </div>
          <div className="ocean-planning-lists">
            <section>
              <h3>Send with your request</h3>
              <ul>{service.customerInputs.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <h3>Quotation factors</h3>
              <ul>{service.costFactors.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>
        </div>
      </section>

      <section className="ocean-section ocean-faq-section" aria-labelledby="ocean-faq-title">
        <div className="marketing-container ocean-faq-layout">
          <div>
            <p className="ocean-section-label">Frequently asked questions</p>
            <h2 id="ocean-faq-title">Sea Freight Questions</h2>
          </div>
          <div className="ocean-faq-list">
            {service.faq.map(([question, answer], index) => (
              <details key={question} open={index === 0}>
                <summary>{question}<span aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="ocean-section ocean-quote-section" id="quote-form" aria-labelledby="ocean-quote-title">
        <div className="marketing-container">
          <div className="ocean-quote-heading">
            <p className="ocean-section-label">Get a sea freight quote</p>
            <h2 id="ocean-quote-title">Start With What You Know</h2>
            <p>Send your product, weight or dimensions, pickup location and delivery address. We can clarify the remaining details with you.</p>
          </div>
          <div className="ocean-quote-form-layout">
            <QuoteForm
              productPage
              source="service-page"
              pageUrl={`${company.website}/services/sea-freight-china-to-usa/`}
              productId="sea-freight-china-to-usa"
              defaultShippingMethod={service.shippingMethod}
              defaultServiceNeeds={service.quoteNeeds}
              defaultDestinationCountry="United States"
              submitLabel="Send My Quote Request"
            />
            <aside className="ocean-contact-card" id="contact-options" aria-labelledby="ocean-contact-title">
              <p className="ocean-section-label">Direct contact</p>
              <h3 id="ocean-contact-title">Discuss Your Cargo with Zoe</h3>
              <p>Already have a packing list or cargo photos? Send them directly.</p>
              <ul>
                <li><span>Email</span><a href={`mailto:${company.email}`}>{company.email}</a></li>
                <li><span>WhatsApp</span><a href={company.whatsappHref}>Message {company.phoneDisplay}</a></li>
                <li><span>Phone</span><a href={`tel:${company.phoneHref}`}>{company.phoneDisplay}</a></li>
              </ul>
              <p className="ocean-contact-note">Space, route and delivery conditions are confirmed for the shipment before booking.</p>
            </aside>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
