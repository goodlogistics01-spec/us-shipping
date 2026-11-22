import MarketingPage, { PageHero } from "../components/MarketingPage";
import { company, createPageMetadata } from "../site-data";

export const metadata = createPageMetadata({
  title: "Privacy Policy | Good Logistics",
  description: "Privacy information for inquiries submitted to the Good Logistics website.",
  path: "/privacy-policy/"
});

export default function PrivacyPolicyPage() {
  return (
    <MarketingPage>
      <PageHero breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} eyebrow="Website Privacy Notice" title="Privacy Policy" lead="How information submitted through this website is used for freight-inquiry follow-up." variant="compact" />
      <section className="marketing-section"><div className="marketing-container marketing-legal-copy">
        <h2>Information submitted through the website</h2><p>When you request a quote, the form may collect your name, company, email, phone or WhatsApp number, cargo information, supplier or origin city, destination, shipment size, cargo-ready date and additional requirements.</p>
        <h2>How the information is used</h2><p>The information is used to review and respond to shipping inquiries, clarify cargo requirements and prepare a proposed shipment scope. Do not submit confidential credentials, payment-card details or information that is not needed for a freight inquiry.</p>
        <h2>Inquiry processing and follow-up</h2><p>To manage website inquiries, the website host and designated service providers may process the submitted information. Inquiry details may be stored in HubSpot for sales follow-up, and Resend may process the same details to notify our designated business inbox. A service provider accepting a request does not by itself prove that an email notification reached the inbox.</p>
        <h2>Cookies and analytics</h2><p>After an inquiry is explicitly accepted, the site uses a short-lived confirmation cookie so the thank-you page can show the correct status. Optional analytics tags load only after consent when a valid measurement container is configured. Contact details and free-text cargo information are not intentionally sent in analytics events.</p>
        <h2>Access and questions</h2><p>You may contact us to ask about information submitted in an inquiry or to request access, correction or deletion where applicable.</p>
        <h2>Contact</h2><p>Questions about this notice can be sent to <a href={`mailto:${company.email}`}>{company.email}</a>.</p>
      </div></section>
    </MarketingPage>
  );
}
