import MarketingPage, { JsonLd } from "./MarketingPage";
import QuoteForm from "./QuoteForm";
import ShipmentCaseStudy from "./ShipmentCaseStudy";
import { company } from "../site-data";

const trustItems = [
  "China-Based Logistics Team",
  "FCL & LCL Shipping Options",
  "Door Delivery Across the USA",
  "Amazon FBA & Commercial Cargo",
  "Oversized Cargo Support"
];

const capabilities = [
  {
    number: "01",
    title: "One Team from China to Final Delivery",
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

// TODO_CONFIRM: Publish only after the route, cargo, solution and result are supported by customer-approved evidence.
const verifiedCaseStudy = null;

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
        <div className="ocean-hero-media" data-image-type="supplied-operational-photo">
          <picture>
            <source
              srcSet="/good-shipping-homepage/assets/crane-truck-warehouse-800.avif 800w, /good-shipping-homepage/assets/crane-truck-warehouse-1400.avif 1400w"
              sizes="100vw"
              type="image/avif"
            />
            <img
              src="/good-shipping-homepage/assets/crane-truck-warehouse.jpg"
              alt="Crane truck and protected cargo during a warehouse handling operation"
              width="1706"
              height="1279"
              fetchPriority="high"
            />
          </picture>
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
            <p>From factory pickup in China to ocean freight, customs coordination and final delivery across the U.S., our team coordinates the shipment from origin to destination.</p>
            <p>FCL, LCL, Amazon FBA, oversized cargo and complex shipments can be reviewed under one shipping plan.</p>
          </div>
          <div className="ocean-hero-actions">
            <a className="ocean-button ocean-button-primary" href="#quote-form">Get a Shipping Quote</a>
            <a className="ocean-button ocean-button-secondary" href="#contact-options">Talk to a Shipping Expert</a>
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
            <p className="ocean-section-label">Existing operations photography</p>
            <h2 id="ocean-real-ops-title">Real Shipments. Real Operations.</h2>
            <p>These project photos document warehouse staging and crane-truck handling. Cargo, customer and route details are not presented as China–USA proof without supporting records.</p>
            <p className="ocean-evidence-note">Photography is used as operational context, not as a claim about a specific customer, lane or shipment result.</p>
          </div>
          <div className="ocean-ops-gallery">
            <figure>
              <picture>
                <source srcSet="/good-shipping-homepage/assets/crane-truck-warehouse-1400.avif" type="image/avif" />
                <img src="/good-shipping-homepage/assets/crane-truck-warehouse.jpg" alt="Palletized cargo staged beside crane-truck equipment in a warehouse" width="1706" height="1279" loading="lazy" />
              </picture>
              <figcaption>Warehouse cargo staging beside crane-truck equipment</figcaption>
            </figure>
            <figure>
              <picture>
                <source srcSet="/good-shipping-homepage/assets/crane-truck-loading-1400.avif" type="image/avif" />
                <img src="/good-shipping-homepage/assets/crane-truck-loading.jpg" alt="Crane-truck cargo handling inside a warehouse" width="1706" height="1279" loading="lazy" />
              </picture>
              <figcaption>Crane-truck cargo handling inside a warehouse</figcaption>
            </figure>
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
            <h2 id="ocean-delivery-title">Delivery Across the United States</h2>
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
            <a className="ocean-button ocean-button-primary" href="#quote-form">Get a Shipping Quote</a>
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

      <ShipmentCaseStudy study={verifiedCaseStudy} />

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
              source="sea-freight-product-page"
              pageUrl={`${company.website}/services/sea-freight-china-to-usa/`}
              productId="sea-freight-china-to-usa"
              productName="Sea Freight from China to the USA"
              submitLabel="Get a Shipping Quote"
            />
            <aside className="ocean-contact-card" id="contact-options" aria-labelledby="ocean-contact-title">
              <p className="ocean-section-label">Direct contact</p>
              <h3 id="ocean-contact-title">Talk to a Shipping Expert</h3>
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
