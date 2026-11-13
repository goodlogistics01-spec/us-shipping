import MarketingPage, { JsonLd } from "./MarketingPage";
import QuoteForm from "./QuoteForm";
import { company } from "../site-data";

const trustItems = [
  "China-Side Shipment Coordination",
  "FCL & LCL Shipping Options",
  "U.S. Delivery Reviewed by ZIP Code",
  "Commercial & FBA Destination Planning",
  "Oversized Cargo Support"
];

const capabilities = [
  {
    number: "01",
    title: "Coordinated from Pickup to Delivery",
    copy: "Pickup, export handoff, ocean freight, customs coordination and U.S. delivery are reviewed under one shipment plan."
  },
  {
    number: "02",
    title: "FCL & LCL Planning",
    copy: "Container options are compared using cargo volume, handling needs, supplier locations and the requested delivery scope."
  },
  {
    number: "03",
    title: "Oversized & Complex Cargo Review",
    copy: "Packed dimensions, weight, lifting points, equipment and site access are checked before a handling plan is proposed."
  },
  {
    number: "04",
    title: "Flexible U.S. Delivery Options",
    copy: "The quotation can include delivery to a warehouse, commercial address, Amazon FBA location or an accessible project site."
  }
];

const solutions = [
  {
    title: "FCL Shipping",
    copy: "Dedicated container space for cargo that fits a full-container plan or benefits from fewer consolidation handoffs.",
    href: "#fcl-lcl",
    label: "Compare FCL"
  },
  {
    title: "LCL Shipping",
    copy: "Shared-container planning for commercial cargo that does not require a full container.",
    href: "#fcl-lcl",
    label: "Compare LCL"
  },
  {
    title: "Door-to-Door Shipping",
    copy: "A defined shipment scope from China pickup through the agreed delivery point in the United States.",
    href: "/services/ddp-shipping-china-to-usa/",
    label: "Explore door delivery"
  },
  {
    title: "Amazon FBA Shipping",
    copy: "Freight planning for inventory that needs carton coordination and delivery to the assigned FBA destination.",
    href: "/services/amazon-fba-shipping/",
    label: "Explore FBA shipping"
  },
  {
    title: "Oversized Cargo Shipping",
    copy: "Route and handling review for machinery, large fixtures and cargo with non-standard dimensions or access needs.",
    href: "/services/oversized-cargo-shipping/",
    label: "Explore oversized cargo"
  }
];

const workflow = [
  ["01", "Cargo Details", "Share the commodity, packaging, dimensions, weight, supplier location and cargo-ready date."],
  ["02", "Pickup & Consolidation", "Pickup and multi-supplier consolidation needs are reviewed before cargo moves."],
  ["03", "Export & Ocean Freight", "The booking scope connects origin handling, export handoff and the selected ocean option."],
  ["04", "Customs & Destination Handling", "Documentation and customs-coordination responsibilities are defined with the destination handling scope."],
  ["05", "Final Delivery", "The address, appointment, equipment and access requirements are confirmed for the delivery plan."]
];

const planningFactors = [
  "Origin city and supplier readiness",
  "Port pair and current sailing options",
  "FCL, LCL or consolidation choice",
  "Export and destination handling scope",
  "Customs review and document readiness",
  "Final delivery distance and appointment needs",
  "Cargo dimensions, packaging and special handling"
];

const comparisonRows = [
  ["Cargo fit", "Cargo suited to dedicated container space", "Cargo that does not require a full container"],
  ["Cost basis", "Quoted by container and route scope", "Based on volume, weight and handling scope"],
  ["Handling", "Fewer consolidation handoffs", "Includes consolidation and deconsolidation handoffs"],
  ["Schedule considerations", "Depends on booking, sailing and destination scope", "Also depends on consolidation and release timing"],
  ["Cargo compatibility", "Useful when separation or dedicated space matters", "Compatibility with other consolidated cargo must be reviewed"],
  ["Oversized cargo", "Equipment and loading method require advance review", "May not fit LCL handling limits; dimensions must be checked"]
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M14 7l5 5-5 5" />
    </svg>
  );
}

export default function OceanFreightPage({ service, schema }) {
  return (
    <MarketingPage>
      <JsonLd data={schema} />

      <section className="ocean-hero">
        <div className="ocean-hero-media ocean-hero-route-visual" data-image-type="brand-route-visual" aria-hidden="true">
          <svg className="ocean-route-line" viewBox="0 0 700 520" aria-hidden="true">
            <path d="M135 115c142 28 100 164 232 188 88 16 75 87 177 104" />
            <circle cx="135" cy="115" r="10" />
            <circle cx="544" cy="407" r="10" />
            <text x="105" y="86">CHINA</text>
            <text x="500" y="454">USA</text>
          </svg>
        </div>

        <div className="marketing-container ocean-hero-content">
          <p className="ocean-kicker">Ocean Freight</p>
          <h1>Sea Freight from China to the USA</h1>
          <p className="ocean-hero-service-line">FCL, LCL &amp; Door-to-Door Shipping</p>
          <div className="ocean-hero-copy">
            <p>From factory pickup in China to ocean freight, customs coordination and delivery to the confirmed U.S. address, our team coordinates the agreed shipment scope.</p>
            <p>FCL, LCL, Amazon FBA, oversized cargo and complex shipments can be reviewed under one shipping plan.</p>
          </div>
          <div className="ocean-hero-actions">
            <a className="ocean-button ocean-button-primary" href="#quote-form">Request a Shipping &amp; Prep Quote</a>
            <a className="ocean-button ocean-button-secondary" href="#contact-options">Discuss Your Cargo</a>
          </div>
        </div>
      </section>

      <aside className="ocean-trust-bar" aria-label="Sea freight service capabilities">
        <ul className="marketing-container ocean-trust-items">
          {trustItems.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </aside>

      <section className="ocean-section ocean-capabilities-section" aria-labelledby="ocean-capabilities-title">
        <div className="marketing-container">
          <div className="ocean-conversion-heading">
            <p className="ocean-section-label">Operational planning</p>
            <h2 id="ocean-capabilities-title">Built Around Real-World Shipping</h2>
            <p>Each shipment starts with the cargo facts and the handoffs needed to move it—not a preset route promise.</p>
          </div>
          <div className="ocean-capability-grid">
            {capabilities.map((item) => (
              <article className="ocean-capability" key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ocean-section ocean-real-ops" aria-labelledby="ocean-real-ops-title">
        <div className="marketing-container ocean-ops-layout">
          <div className="ocean-ops-copy">
            <p className="ocean-section-label">Quote readiness</p>
            <h2 id="ocean-real-ops-title">Cargo Facts Before Route Promises</h2>
            <p>A useful sea-freight quotation starts with the product, packed dimensions, weight, supplier location and delivery conditions. Unknown weight or volume can be marked for follow-up.</p>
            <p className="ocean-evidence-note">The quotation confirms the shipment-specific scope; it does not imply fixed schedules, customs acceptance or an unconditional delivery promise.</p>
          </div>
          <div className="ocean-ops-evidence">
            <div className="ocean-ops-gallery" role="group" aria-label="Selected cargo handling photos">
              <figure>
                <picture>
                  <source type="image/avif" srcSet="/good-shipping-homepage/assets/operations/consolidation-staging-480.avif 480w, /good-shipping-homepage/assets/operations/consolidation-staging-800.avif 800w, /good-shipping-homepage/assets/operations/consolidation-staging-1000.avif 1000w" sizes="(max-width: 760px) 100vw, (max-width: 1023px) 48vw, 28vw" />
                  <source type="image/webp" srcSet="/good-shipping-homepage/assets/operations/consolidation-staging-480.webp 480w, /good-shipping-homepage/assets/operations/consolidation-staging-800.webp 800w, /good-shipping-homepage/assets/operations/consolidation-staging-1000.webp 1000w" sizes="(max-width: 760px) 100vw, (max-width: 1023px) 48vw, 28vw" />
                  <img src="/good-shipping-homepage/assets/operations/consolidation-staging-1000.jpg" alt="Mixed crates and packaged cargo staged inside a consolidation facility." width="1000" height="750" loading="lazy" decoding="async" />
                </picture>
                <figcaption>Crates and packaged cargo shown in a handling area; the shipment-specific plan is confirmed separately.</figcaption>
              </figure>
              <figure>
                <picture>
                  <source type="image/avif" srcSet="/good-shipping-homepage/assets/operations/container-handoff-480.avif 480w, /good-shipping-homepage/assets/operations/container-handoff-800.avif 800w, /good-shipping-homepage/assets/operations/container-handoff-1200.avif 1200w" sizes="(max-width: 760px) 100vw, (max-width: 1023px) 48vw, 28vw" />
                  <source type="image/webp" srcSet="/good-shipping-homepage/assets/operations/container-handoff-480.webp 480w, /good-shipping-homepage/assets/operations/container-handoff-800.webp 800w, /good-shipping-homepage/assets/operations/container-handoff-1200.webp 1200w" sizes="(max-width: 760px) 100vw, (max-width: 1023px) 48vw, 28vw" />
                  <img src="/good-shipping-homepage/assets/operations/container-handoff-1200.jpg" alt="Closed shipping container doors at a cargo handoff." width="1200" height="1500" loading="lazy" decoding="async" />
                </picture>
                <figcaption>Closed-container handoff context; the container identity and shipment scope are confirmed separately.</figcaption>
              </figure>
            </div>
            <ul className="ocean-factor-list" aria-label="Details reviewed for a sea freight quote">
              <li>Product name and packaging</li>
              <li>Pickup city and cargo-ready date</li>
              <li>Destination ZIP code and access conditions</li>
              <li>Known weight, volume or packed dimensions</li>
              <li>FCL, LCL or recommendation request</li>
              <li>FBA, residential, liftgate or oversized needs</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="ocean-section ocean-solutions-section" id="shipping-solutions" aria-labelledby="ocean-solutions-title">
        <div className="marketing-container">
          <div className="ocean-conversion-heading">
            <p className="ocean-section-label">Shipment options</p>
            <h2 id="ocean-solutions-title">China to USA Shipping Solutions</h2>
            <p>Use the cargo and delivery requirements to identify the option worth quoting.</p>
          </div>
          <div className="ocean-solutions-grid">
            {solutions.map((solution, index) => (
              <article className="ocean-solution-card" key={solution.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{solution.title}</h3>
                <p>{solution.copy}</p>
                <a className="ocean-text-link" href={solution.href}>{solution.label} <ArrowIcon /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ocean-section ocean-workflow-section" aria-labelledby="ocean-workflow-title">
        <div className="marketing-container">
          <div className="ocean-conversion-heading ocean-conversion-heading-light">
            <p className="ocean-section-label">Shipment workflow</p>
            <h2 id="ocean-workflow-title">How Sea Freight from China to the USA Works</h2>
          </div>
          <ol className="ocean-workflow-rail">
            {workflow.map(([number, title, copy]) => (
              <li key={number}>
                <span className="ocean-workflow-number">{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ocean-section ocean-delivery-section" aria-labelledby="ocean-delivery-title">
        <div className="marketing-container ocean-delivery-layout">
          <div>
            <p className="ocean-section-label">Destination planning</p>
            <h2 id="ocean-delivery-title">U.S. Final-Delivery Planning</h2>
            <p>The final-delivery scope can be planned after the destination address, access conditions and unloading or appointment requirements are confirmed.</p>
          </div>
          <div className="ocean-delivery-groups">
            <div>
              <h3>Broad delivery regions</h3>
              <ul><li>Western United States</li><li>Central United States</li><li>Eastern United States</li></ul>
            </div>
            <div>
              <h3>Delivery points</h3>
              <ul><li>Warehouses</li><li>Commercial addresses</li><li>Amazon FBA locations</li><li>Accessible final-mile sites</li></ul>
            </div>
          </div>
        </div>
      </section>

      <section className="ocean-section ocean-transit-section" aria-labelledby="ocean-transit-title">
        <div className="marketing-container ocean-transit-layout">
          <div>
            <p className="ocean-section-label">Schedule scope</p>
            <h2 id="ocean-transit-title">Typical Transit Planning</h2>
            <p>Transit planning is route- and shipment-specific. A working schedule is reviewed after the shipment details and current operating conditions are known.</p>
            <a className="ocean-button ocean-button-primary" href="#quote-form">Request a Shipping &amp; Prep Quote</a>
          </div>
          <ul className="ocean-factor-list">
            {planningFactors.map((factor) => <li key={factor}>{factor}</li>)}
          </ul>
        </div>
      </section>

      <section className="ocean-section ocean-comparison-section" id="fcl-lcl" aria-labelledby="ocean-comparison-title">
        <div className="marketing-container">
          <div className="ocean-conversion-heading">
            <p className="ocean-section-label">Container comparison</p>
            <h2 id="ocean-comparison-title">FCL vs LCL: Which Option Fits Your Shipment?</h2>
            <p>This comparison is a planning guide. The quotation should compare the complete route and delivery scope.</p>
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

      <section className="marketing-section marketing-soft-section" aria-labelledby="ocean-fit-title">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Best Fit</p>
            <h2 id="ocean-fit-title">When sea freight may fit</h2>
            <ul className="marketing-check-list">
              {service.bestFor.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="marketing-eyebrow">Specific Operations</p>
            <h2>What Good Logistics can coordinate</h2>
            <ul className="marketing-check-list">
              {service.operations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="marketing-section" aria-labelledby="ocean-boundaries-title">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Service Boundaries</p>
            <h2 id="ocean-boundaries-title">What is confirmed separately</h2>
            <ul className="marketing-check-list">
              {service.boundaries.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="marketing-eyebrow">Customer Inputs</p>
            <h2>What to provide</h2>
            <ul className="marketing-check-list">
              {service.customerInputs.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-soft-section" aria-labelledby="ocean-cost-title">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Cost Factors</p>
            <h2 id="ocean-cost-title">What influences the quotation</h2>
            <ul className="marketing-check-list">
              {service.costFactors.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="marketing-eyebrow">How to Start</p>
            <h2>Move from details to an agreed scope</h2>
            <ol className="marketing-step-list">
              {service.startSteps.map((item, index) => (
                <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="ocean-section ocean-faq-section" aria-labelledby="ocean-faq-title">
        <div className="marketing-container ocean-faq-layout">
          <div>
            <p className="ocean-section-label">Frequently asked questions</p>
            <h2 id="ocean-faq-title">Questions to Settle Before Booking</h2>
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
            <p className="ocean-section-label">Route-specific quotation</p>
            <h2 id="ocean-quote-title">Tell Us About Your Shipment</h2>
            <p>Share the cargo, pickup and delivery details that affect the route, handling plan and quotation scope.</p>
          </div>
          <div className="ocean-quote-form-layout">
            <QuoteForm
              productPage
              source="service-page"
              pageUrl={`${company.website}/services/sea-freight-china-to-usa/`}
              productId="sea-freight-china-to-usa"
              defaultShippingMethod={service.shippingMethod}
              defaultServiceNeeds={service.quoteNeeds}
              submitLabel="Request a Shipping & Prep Quote"
            />
            <aside className="ocean-contact-card" id="contact-options" aria-labelledby="ocean-contact-title">
              <p className="ocean-section-label">Direct contact</p>
              <h3 id="ocean-contact-title">Discuss Your Cargo</h3>
              <p>If you already have a packing list or cargo photos, you can send them directly for review.</p>
              <ul>
                <li><span>Email</span><a href={`mailto:${company.email}`}>{company.email}</a></li>
                <li><span>WhatsApp</span><a href={company.whatsappHref}>Message {company.phoneDisplay}</a></li>
                <li><span>Phone</span><a href={`tel:${company.phoneHref}`}>{company.phoneDisplay}</a></li>
              </ul>
              <p className="ocean-contact-note">A response can confirm what information is still needed. It does not confirm space, customs acceptance or a transit commitment.</p>
            </aside>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
