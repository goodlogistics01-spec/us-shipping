import MarketingPage, { Breadcrumbs } from "../components/MarketingPage";
import { company, createPageMetadata } from "../site-data";

export const metadata = createPageMetadata({
  title: "Contact Good Logistics | China to USA Freight",
  description: "Contact Good Logistics about freight shipping from China to the United States.",
  path: "/contact/"
});

export default function ContactPage() {
  return (
    <MarketingPage>
      <section className="marketing-page-hero">
        <div className="marketing-container marketing-content-narrow"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} /><p className="marketing-eyebrow">Contact</p><h1>Talk with Good Logistics</h1><p className="marketing-lead">Use the quote form for a structured shipping review, or contact the team by email or WhatsApp.</p></div>
      </section>
      <section className="marketing-section">
        <div className="marketing-container marketing-contact-grid">
          <article className="marketing-content-card"><h2>Email</h2><p>For cargo details, commercial questions and supporting files.</p><a className="marketing-text-link" href={`mailto:${company.email}`}>{company.email}</a></article>
          <article className="marketing-content-card"><h2>WhatsApp / Phone</h2><p>For concise shipment questions and follow-up.</p><a className="marketing-text-link" href={company.whatsappHref}>{company.phoneDisplay}</a></article>
          <article className="marketing-content-card"><h2>Shipping Quote</h2><p>Provide origin, destination, cargo and readiness information.</p><a className="marketing-text-link" href="/quote/">Open the quote form</a></article>
        </div>
      </section>
    </MarketingPage>
  );
}
