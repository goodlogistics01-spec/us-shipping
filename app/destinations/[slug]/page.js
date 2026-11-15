import { notFound } from "next/navigation";
import MarketingPage, { Breadcrumbs, JsonLd } from "../../components/MarketingPage";
import { company, createPageMetadata, destinations } from "../../site-data";

export function generateStaticParams() {
  return Object.keys(destinations).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const destination = destinations[slug];
  if (!destination) return {};
  return createPageMetadata({
    title: `${destination.title} | GOOD LOGISTICS`,
    description: destination.description,
    path: `/destinations/${slug}/`
  });
}

export default async function DestinationPage({ params }) {
  const { slug } = await params;
  const destination = destinations[slug];
  if (!destination) notFound();

  const url = `${company.website}/destinations/${slug}/`;
  const whatsappHref = `${company.whatsappHref}?text=${encodeURIComponent(`Hello Zoe, I'd like to discuss shipping from China to ${destination.areaServed}.`)}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: destination.title,
        description: destination.description,
        url,
        provider: { "@type": "Organization", name: company.name, url: company.website },
        areaServed: { "@type": "AdministrativeArea", name: destination.areaServed },
        serviceType: "Freight forwarding from China"
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: company.website },
          { "@type": "ListItem", position: 2, name: "Destinations", item: `${company.website}/#destinations` },
          { "@type": "ListItem", position: 3, name: destination.title, item: url }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: destination.faq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer }
        }))
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
                <a className="marketing-button marketing-button-primary" href="/quote/?service_need=shipping">Get a Shipping Quote</a>
                <a className="marketing-button marketing-button-secondary" href={whatsappHref}>Chat with Zoe</a>
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
            <p className="marketing-eyebrow">Address-Specific Planning</p>
            <h2>{destination.focusTitle}</h2>
            <p>{destination.focusCopy}</p>
          </div>
          <div>
            <p className="marketing-eyebrow">Before Quotation</p>
            <h2>Details that affect the plan</h2>
            <ul className="marketing-check-list">
              {destination.considerations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <section className="marketing-section marketing-soft-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Coordinated Scope</p>
            <h2>What Good Logistics can coordinate</h2>
            <ul className="marketing-check-list">
              {destination.operations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="marketing-eyebrow">Customer Inputs</p>
            <h2>What to send for an address review</h2>
            <ul className="marketing-check-list">
              {destination.customerInputs.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <section className="marketing-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Before Booking</p>
            <h2>What the quotation should clarify</h2>
            <ul className="marketing-check-list">
              {destination.quoteClarifies.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="marketing-note-card">
            <p className="marketing-eyebrow">Shipment-Specific Boundaries</p>
            <h2>No blanket route, time or coverage promise</h2>
            <p>{destination.boundary}</p>
          </div>
        </div>
      </section>
      <section className="marketing-section marketing-soft-section">
        <div className="marketing-container marketing-content-narrow">
          <p className="marketing-eyebrow">Frequently Asked Questions</p>
          <h2>Questions to settle before booking</h2>
          <div className="marketing-faq-list">
            {destination.faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="marketing-cta">
        <div className="marketing-container marketing-cta-inner">
          <div><h2>Planning cargo for this destination?</h2><p>Send the final ZIP code, cargo details and delivery conditions for review.</p></div>
          <a className="marketing-button marketing-button-primary" href="/quote/?service_need=shipping">Get a Shipping Quote</a>
        </div>
      </section>
    </MarketingPage>
  );
}
