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
              <p className="marketing-eyebrow">For an Accurate Quote</p>
              <h2>Send the final delivery address</h2>
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
            <p className="marketing-eyebrow">Destination Details</p>
            <h2>{destination.focusTitle}</h2>
            <p>{destination.focusCopy}</p>
          </div>
          <div>
            <p className="marketing-eyebrow">What Changes The Plan</p>
            <h2>Access and delivery requirements</h2>
            <ul className="marketing-check-list">
              {destination.considerations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <section className="marketing-section marketing-soft-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Delivery Options</p>
            <h2>What we can arrange</h2>
            <ul className="marketing-check-list">
              {destination.operations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="marketing-eyebrow">What To Send</p>
            <h2>Details needed for the last mile</h2>
            <ul className="marketing-check-list">
              {destination.customerInputs.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <section className="marketing-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Your Quote</p>
            <h2>What it should show</h2>
            <ul className="marketing-check-list">
              {destination.quoteClarifies.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="marketing-eyebrow">Frequently Asked Questions</p>
            <h2>Common questions</h2>
            <div className="marketing-faq-list">
              {destination.faq.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
        <div className="marketing-container">
          <p className="marketing-section-note">Routes, schedules and final-delivery options depend on the cargo and confirmed address. {destination.boundary}</p>
        </div>
      </section>
      <section className="marketing-cta">
        <div className="marketing-container marketing-cta-inner">
          <div><h2>Shipping to this destination?</h2><p>Send the final ZIP code, cargo details and unloading needs for a destination-specific quote.</p></div>
          <a className="marketing-button marketing-button-primary" href="/quote/?service_need=shipping">Get a Shipping Quote</a>
        </div>
      </section>
    </MarketingPage>
  );
}
