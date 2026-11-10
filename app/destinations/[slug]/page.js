import { notFound } from "next/navigation";
import MarketingPage, { Breadcrumbs, JsonLd } from "../../components/MarketingPage";
import { company, destinations } from "../../site-data";

export function generateStaticParams() {
  return Object.keys(destinations).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const destination = destinations[slug];
  if (!destination) return {};
  const url = `${company.website}/destinations/${slug}/`;
  return {
    title: { absolute: `${destination.title} | Good Logistics` },
    description: destination.description,
    alternates: { canonical: url },
    openGraph: {
      title: destination.title,
      description: destination.description,
      url,
      siteName: company.name,
      type: "website",
      images: ["/good-shipping-homepage/assets/good-logistics-logo.png"]
    }
  };
}

export default async function DestinationPage({ params }) {
  const { slug } = await params;
  const destination = destinations[slug];
  if (!destination) notFound();

  const url = `${company.website}/destinations/${slug}/`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: destination.title,
        description: destination.description,
        url,
        provider: { "@type": "Organization", name: company.name, url: company.website },
        serviceType: "Freight forwarding from China"
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: company.website },
          { "@type": "ListItem", position: 2, name: "Destinations", item: `${company.website}/#destinations` },
          { "@type": "ListItem", position: 3, name: destination.title, item: url }
        ]
      }
    ]
  };

  return (
    <MarketingPage>
      <JsonLd data={schema} />
      <section className="marketing-hero marketing-destination-hero">
        <div className="marketing-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Destinations", href: "/#destinations" }, { label: destination.title }]} />
          <div className="marketing-hero-grid">
            <div>
              <p className="marketing-eyebrow">U.S. Destination Planning</p>
              <h1>{destination.title}</h1>
              <p className="marketing-lead">{destination.summary}</p>
              <div className="marketing-actions">
                <a className="marketing-button marketing-button-primary" href="/quote/?service_need=shipping">Request a Shipping Quote</a>
                <a className="marketing-button marketing-button-secondary" href="/#destinations">View Destinations</a>
              </div>
            </div>
            <div className="marketing-note-card">
              <p className="marketing-eyebrow">Route Review</p>
              <h2>Confirm the address before confirming the scope</h2>
              <ul className="marketing-check-list">
                <li>Final ZIP code and delivery type</li>
                <li>Commercial, residential or project-site access</li>
                <li>Appointment, liftgate and unloading requirements</li>
                <li>Island or remote-area carrier handoff</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="marketing-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Before Quotation</p>
            <h2>Destination details that affect the plan</h2>
            <ul className="marketing-check-list">
              {destination.considerations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="marketing-note-card">
            <p className="marketing-eyebrow">No Fixed-Time Promise</p>
            <h2>Routing is confirmed against current conditions</h2>
            <p>Schedules, customs steps, island or remote-area handoffs and final delivery access can change the complete shipment timeline.</p>
            <p>A quotation should state the planned route, delivery scope, known exclusions and information still requiring confirmation.</p>
          </div>
        </div>
      </section>
      <section className="marketing-cta">
        <div className="marketing-container marketing-cta-inner">
          <div><h2>Planning cargo for this destination?</h2><p>Send the final ZIP code, cargo details and delivery conditions for review.</p></div>
          <a className="marketing-button marketing-button-primary" href="/quote/?service_need=shipping">Request a Shipping Quote</a>
        </div>
      </section>
    </MarketingPage>
  );
}
