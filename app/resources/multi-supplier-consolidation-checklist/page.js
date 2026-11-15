import MarketingPage, { Breadcrumbs, JsonLd } from "../../components/MarketingPage";
import { company, createPageMetadata } from "../../site-data";

const pagePath = "/resources/multi-supplier-consolidation-checklist/";
const quoteHref = "/quote/?service_need=supplier-pickup&service_need=consolidation&service_need=shipping";

export const metadata = createPageMetadata({
  title: "Multi-Supplier Consolidation Checklist | GOOD LOGISTICS",
  description: "A practical checklist for supplier contacts, carton data, receiving instructions, cargo checks and release planning before consolidating shipments in China.",
  path: pagePath
});

const sections = [
  {
    number: "01",
    title: "Create one supplier-ready list",
    intro: "List every supplier before pickup planning starts so timing and handoffs can be compared together.",
    items: [
      "Supplier name, pickup address and contact person",
      "Product or purchase-order reference for each supplier",
      "Expected cargo-ready date and pickup restrictions",
      "Estimated package count, packed dimensions and gross weight"
    ]
  },
  {
    number: "02",
    title: "Share packing and commercial records",
    intro: "Preliminary records help identify missing data before cargo arrives at a handling location.",
    items: [
      "Packing list or expected carton and pallet quantities",
      "Product description, value and intended use",
      "Available commercial invoice information",
      "Any approved label, carton-mark or packaging reference"
    ]
  },
  {
    number: "03",
    title: "Choose the check you actually need",
    intro: "Receiving checks and product-quality inspection are separate scopes and can be requested together.",
    items: [
      "Receiving check: package quantity against the provided record",
      "Receiving check: outer-carton condition, labels and visible damage",
      "Product inspection: agreed sampling, criteria and reporting",
      "Instructions for shortages, visible damage or other exceptions"
    ]
  },
  {
    number: "04",
    title: "Define handling and release instructions",
    intro: "Clarify what should happen after receipt instead of assuming every carton is released together.",
    items: [
      "Temporary storage or staged-release requirement",
      "Combined shipment or split-release instruction",
      "Repacking, labeling, kitting or other confirmed preparation",
      "Cargo-compatibility, stacking or special-handling concerns"
    ]
  },
  {
    number: "05",
    title: "Confirm the shipment and destination",
    intro: "The consolidation plan should connect to a real freight and delivery requirement.",
    items: [
      "Ocean, air, express or a request to compare options",
      "Destination country, city, ZIP code or assigned warehouse",
      "Commercial, residential, FBA or project-site delivery type",
      "Appointment, liftgate, unloading or access requirements"
    ]
  }
];

export default function ConsolidationChecklistPage() {
  const url = `${company.website}${pagePath}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Multi-Supplier Consolidation Checklist",
        description: metadata.description,
        url,
        mainEntityOfPage: url,
        publisher: { "@type": "Organization", name: company.name, url: company.website },
        dateModified: "2026-11-15"
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: company.website },
          { "@type": "ListItem", position: 2, name: "Resources", item: `${company.website}/resources/` },
          { "@type": "ListItem", position: 3, name: "Multi-Supplier Consolidation Checklist", item: url }
        ]
      }
    ]
  };

  return (
    <MarketingPage>
      <JsonLd data={schema} />
      <section className="marketing-page-hero">
        <div className="marketing-container marketing-content-narrow">
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Resources", href: "/resources/" },
            { label: "Consolidation Checklist" }
          ]} />
          <p className="marketing-eyebrow">Importer Preparation Guide</p>
          <h1>Multi-Supplier Consolidation Checklist</h1>
          <p className="marketing-lead">Prepare the supplier, package, check and release details needed to review pickups and consolidation in China without assuming every shipment follows the same plan.</p>
          <div className="marketing-actions">
            <a className="marketing-button marketing-button-primary" href={quoteHref}>Get a Consolidation Quote</a>
            <a className="marketing-button marketing-button-secondary" href="/services/supplier-consolidation/">View the Service</a>
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-container marketing-content-narrow">
          <p className="marketing-eyebrow">Before You Request a Plan</p>
          <h2>Use confirmed data where available</h2>
          <p>This checklist is a preparation aid, not a promise that cargo can be combined unconditionally. Supplier readiness, product restrictions, cargo compatibility, storage needs and destination requirements are reviewed before the scope is accepted.</p>
        </div>
      </section>

      <section className="marketing-section marketing-soft-section">
        <div className="marketing-container marketing-guide-stack">
          {sections.map((section) => (
            <article className="marketing-guide-section" key={section.number}>
              <div className="marketing-guide-heading">
                <span>{section.number}</span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.intro}</p>
                </div>
              </div>
              <ul className="marketing-check-list">
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Receiving Checks</p>
            <h2>Package-level checks</h2>
            <p>Receiving checks can cover agreed package quantities, outer cartons, labels and visible damage against customer-provided records. They do not automatically include opening every unit or judging product quality.</p>
          </div>
          <div>
            <p className="marketing-eyebrow">Product Inspection</p>
            <h2>A separate agreed scope</h2>
            <p>Sampling, product criteria, tolerances, evidence and reporting must be confirmed before a product-quality inspection begins. This site does not claim laboratory testing, AQL qualification or automatic 100% inspection.</p>
          </div>
        </div>
      </section>

      <section className="marketing-cta">
        <div className="marketing-container marketing-cta-inner">
          <div>
            <h2>Have several suppliers to coordinate?</h2>
            <p>Send the available list now. Missing non-critical details can be confirmed with Zoe.</p>
          </div>
          <a className="marketing-button marketing-button-primary" href={quoteHref}>Get a Consolidation Quote</a>
        </div>
      </section>
    </MarketingPage>
  );
}
