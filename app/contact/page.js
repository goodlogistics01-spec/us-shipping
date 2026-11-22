import MarketingPage, { PageHero } from "../components/MarketingPage";
import { company, createPageMetadata } from "../site-data";

export const metadata = createPageMetadata({
  title: "Contact GOOD LOGISTICS | International Freight from China",
  description: "Contact GOOD LOGISTICS about China-side cargo operations and international ocean, air or express freight.",
  path: "/contact/"
});

export default function ContactPage() {
  return (
    <MarketingPage>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Contact"
        title="Discuss Your Cargo with Zoe"
        lead="Use the quote form for a structured request, or contact Zoe directly when you have a quick shipment question."
        variant="compact"
      />
      <section className="marketing-section">
        <div className="marketing-container marketing-contact-grid">
          <article className="marketing-content-card"><h2>Email</h2><p>For cargo details, commercial questions and supporting files.</p><a className="marketing-text-link" href={`mailto:${company.email}`}>{company.email}</a></article>
          <article className="marketing-content-card"><h2>WhatsApp</h2><p>For concise shipment questions and follow-up.</p><a className="marketing-text-link" href={company.whatsappHref}>Chat with Zoe</a></article>
          <article className="marketing-content-card"><h2>Phone</h2><p>Call Zoe during China business hours.</p><a className="marketing-text-link" href={`tel:${company.phoneHref}`}>{company.phoneDisplay}</a></article>
          <article className="marketing-content-card"><h2>Shipping Quote</h2><p>Provide origin, destination, cargo and readiness information.</p><a className="marketing-text-link" href="/quote/">Open the quote form</a></article>
        </div>
      </section>
    </MarketingPage>
  );
}
