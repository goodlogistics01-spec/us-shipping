import MarketingPage, { JsonLd } from "./MarketingPage";
import QuoteForm from "./QuoteForm";
import { company } from "../site-data";

const trustItems = [
  "China-Side Pickup & Consolidation",
  "FCL & LCL Shipping Options",
  "U.S. Delivery Planned by Address & ZIP",
  "Commercial & FBA Destination Planning",
  "Oversized Cargo Support"
];

const capabilities = [
  {
    number: "01",
    title: "One Plan from Pickup to Delivery",
    copy: "Your quote can cover pickup, ocean freight, customs-clearance coordination and U.S. delivery."
  },
  {
    number: "02",
    title: "FCL & LCL Planning",
    copy: "We compare container options using cargo volume, handling needs and supplier locations."
  },
  {
    number: "03",
    title: "Oversized & Complex Cargo",
    copy: "Send packed dimensions, weight, lifting points and site access so we can plan handling."
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
    copy: "Dedicated container space for cargo that fills a container or benefits from fewer cargo transfers.",
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
    copy: "Pickup in China through delivery to the agreed U.S. point can be included in one quote.",
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
    copy: "Route and handling planning for machinery, large fixtures and cargo with non-standard dimensions or access needs.",
    href: "/services/oversized-cargo-shipping/",
    label: "Explore oversized cargo"
  }
];

const workflow = [
  ["01", "Cargo Details", "Share the commodity, packaging, dimensions, weight, supplier location and cargo-ready date."],
  ["02", "Pickup & Consolidation", "We arrange the agreed pickups and combine compatible cargo."],
  ["03", "Export & Ocean Freight", "We connect origin handling to the booked ocean option."],
  ["04", "Customs & Destination Handling", "We coordinate required documents, customs-broker responsibilities and destination handling."],
  ["05", "Final Delivery", "We use the address, appointment, equipment and access needs to plan delivery."]
];

const comparisonRows = [
  ["Cargo fit", "Cargo suited to dedicated container space", "Cargo that does not require a full container"],
  ["Cost basis", "Quoted by container, route and included services", "Based on volume, weight and handling"],
  ["Handling", "Fewer cargo transfers", "Includes consolidation and deconsolidation transfers"],
  ["Schedule considerations", "Depends on booking, sailing and final delivery", "Also depends on consolidation and release timing"],
  ["Cargo compatibility", "Dedicated space keeps cargo separate", "Shared space requires compatible cargo"],
  ["Oversized cargo", "Needs advance equipment and loading planning", "May exceed LCL handling limits; dimensions must be checked"]
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
            <p>GOOD LOGISTICS arranges factory pickup, ocean freight, customs-clearance coordination and delivery to the agreed U.S. address. Compare FCL, LCL, FBA, oversized and complex-cargo options in one quote.</p>
          </div>
          <div className="ocean-hero-actions">
            <a className="ocean-button ocean-button-primary" href="#quote-form" data-quote-location="ocean_hero">Get a Shipping Quote</a>
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
            <p>Each shipment starts with the cargo facts, pickup needs and delivery address.</p>
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
            <p className="ocean-section-label">What to send</p>
            <h2 id="ocean-real-ops-title">Start With the Cargo Facts</h2>
            <p>A useful sea-freight quotation starts with the product, packed dimensions, weight, supplier location and delivery conditions. Unknown weight or volume can be marked for follow-up.</p>
            <p className="ocean-evidence-note">Your quote lists the included services and current sailing and customs assumptions.</p>
          </div>
          <div className="ocean-ops-evidence">
            <div className="ocean-ops-gallery" role="group" aria-label="Selected cargo handling photos">
              <figure>
                <picture>
                  <source type="image/avif" srcSet="/good-shipping-homepage/assets/operations/empty-container-interior-480.avif 480w, /good-shipping-homepage/assets/operations/empty-container-interior-800.avif 800w, /good-shipping-homepage/assets/operations/empty-container-interior-1200.avif 1200w" sizes="(max-width: 760px) 100vw, (max-width: 1023px) 48vw, 28vw" />
                  <source type="image/webp" srcSet="/good-shipping-homepage/assets/operations/empty-container-interior-480.webp 480w, /good-shipping-homepage/assets/operations/empty-container-interior-800.webp 800w, /good-shipping-homepage/assets/operations/empty-container-interior-1200.webp 1200w" sizes="(max-width: 760px) 100vw, (max-width: 1023px) 48vw, 28vw" />
                  <img src="/good-shipping-homepage/assets/operations/empty-container-interior-1200.jpg" alt="Empty shipping container interior before cargo loading." width="1200" height="900" loading="lazy" decoding="async" />
                </picture>
                <figcaption>Container interior before cargo loading.</figcaption>
              </figure>
              <figure>
                <picture>
                  <source type="image/avif" srcSet="/good-shipping-homepage/assets/operations/fcl-loaded-cartons-480.avif 480w, /good-shipping-homepage/assets/operations/fcl-loaded-cartons-800.avif 800w, /good-shipping-homepage/assets/operations/fcl-loaded-cartons-1000.avif 1000w" sizes="(max-width: 760px) 100vw, (max-width: 1023px) 48vw, 28vw" />
                  <source type="image/webp" srcSet="/good-shipping-homepage/assets/operations/fcl-loaded-cartons-480.webp 480w, /good-shipping-homepage/assets/operations/fcl-loaded-cartons-800.webp 800w, /good-shipping-homepage/assets/operations/fcl-loaded-cartons-1000.webp 1000w" sizes="(max-width: 760px) 100vw, (max-width: 1023px) 48vw, 28vw" />
                  <img src="/good-shipping-homepage/assets/operations/fcl-loaded-cartons-1000.jpg" alt="Cartoned cargo arranged inside an open shipping container during loading." width="1000" height="1250" loading="lazy" decoding="async" />
                </picture>
                <figcaption>Cartons positioned during loading. Dimensions and loading order guide container use and handling.</figcaption>
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
            <p>Share the destination address, access, appointment and unloading needs so we can plan the final-mile leg.</p>
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

      <section className="ocean-section ocean-comparison-section" id="fcl-lcl" aria-labelledby="ocean-comparison-title">
        <div className="marketing-container">
          <div className="ocean-conversion-heading">
            <p className="ocean-section-label">Container comparison</p>
            <h2 id="ocean-comparison-title">FCL vs LCL: Which Option Fits Your Shipment?</h2>
            <p>Compare the full route, cargo transfers and final delivery—not only the ocean leg.</p>
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
            <h2>What the service can include</h2>
            <ul className="marketing-check-list">
              {service.operations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="marketing-section" aria-labelledby="ocean-boundaries-title">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Before Booking</p>
            <h2 id="ocean-boundaries-title">Details That Affect the Service</h2>
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
            <h2>Build the quote from your cargo details</h2>
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
            <h2 id="ocean-quote-title">Tell Us About Your Shipment</h2>
            <p>Share the cargo, pickup and delivery details so we can price the route and handling.</p>
          </div>
          <div className="ocean-quote-form-layout">
            <QuoteForm
              productPage
              source="service-page"
              pageUrl={`${company.website}/services/sea-freight-china-to-usa/`}
              productId="sea-freight-china-to-usa"
              defaultShippingMethod={service.shippingMethod}
              defaultServiceNeeds={service.quoteNeeds}
              submitLabel="Send My Quote Request"
            />
            <aside className="ocean-contact-card" id="contact-options" aria-labelledby="ocean-contact-title">
              <p className="ocean-section-label">Direct contact</p>
              <h3 id="ocean-contact-title">Discuss Your Cargo</h3>
              <p>If you already have a packing list or cargo photos, send them directly to Zoe.</p>
              <ul>
                <li><span>Email</span><a href={`mailto:${company.email}`}>{company.email}</a></li>
                <li><span>WhatsApp</span><a href={company.whatsappHref}>Message {company.phoneDisplay}</a></li>
                <li><span>Phone</span><a href={`tel:${company.phoneHref}`}>{company.phoneDisplay}</a></li>
              </ul>
              <p className="ocean-contact-note">Space, customs acceptance and transit timing are set only after the booking details are available.</p>
            </aside>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
