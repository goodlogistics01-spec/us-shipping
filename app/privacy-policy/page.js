import MarketingPage, { Breadcrumbs } from "../components/MarketingPage";
import { company, createPageMetadata } from "../site-data";

export const metadata = createPageMetadata({
  title: "Privacy Policy | Good Logistics",
  description: "Privacy information for inquiries submitted to the Good Logistics website.",
  path: "/privacy-policy/"
});

export default function PrivacyPolicyPage() {
  return (
    <MarketingPage>
      <section className="marketing-page-hero"><div className="marketing-container marketing-content-narrow"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} /><p className="marketing-eyebrow">Website Privacy Notice</p><h1>Privacy Policy</h1><p className="marketing-lead">How information submitted through this website is used for freight-inquiry follow-up.</p></div></section>
      <section className="marketing-section"><div className="marketing-container marketing-legal-copy">
        <h2>Information submitted through the website</h2><p>When you request a quote, the form may collect your name, company, email, phone or WhatsApp number, cargo information, supplier or origin city, U.S. destination, shipment size, cargo-ready date and additional requirements.</p>
        <h2>How the information is used</h2><p>The information is used to review and respond to shipping inquiries, clarify cargo requirements and prepare a proposed shipment scope. Do not submit confidential credentials, payment-card details or information that is not needed for a freight inquiry.</p>
        <h2>Form delivery provider</h2><p>Inquiry form data is transmitted to our designated business inbox through a third-party delivery provider. That provider and the website host may process the information needed to deliver the request.</p>
        <h2>Cookies and analytics</h2><p>After an inquiry is explicitly accepted, the site uses a short-lived confirmation cookie so the thank-you page can show the correct status. Optional analytics tags load only after consent when a valid measurement container is configured. Contact details and free-text cargo information are not intentionally sent in analytics events.</p>
        <h2>Access and questions</h2><p>You may contact us to ask about information submitted in an inquiry or to request access, correction or deletion where applicable.</p>
        <h2>Contact</h2><p>Questions about this notice can be sent to <a href={`mailto:${company.email}`}>{company.email}</a>.</p>
      </div></section>
    </MarketingPage>
  );
}
