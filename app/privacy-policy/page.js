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
      <section className="marketing-page-hero"><div className="marketing-container marketing-content-narrow"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} /><p className="marketing-eyebrow">Working draft — review pending</p><h1>Privacy Policy</h1><p className="marketing-lead">This draft reflects the website's current inquiry workflow. It requires final company and qualified legal review before production publication.</p></div></section>
      <section className="marketing-section"><div className="marketing-container marketing-legal-copy">
        <h2>Information submitted through the website</h2><p>When you request a quote, the form may collect your name, company, email, phone or WhatsApp number, cargo information, supplier or origin city, U.S. destination, shipment size, cargo-ready date and additional requirements.</p>
        <h2>How the information is used</h2><p>The information is used to review and respond to shipping inquiries, clarify cargo requirements and prepare a proposed shipment scope. Do not submit confidential credentials, payment-card details or information that is not needed for a freight inquiry.</p>
        <h2>Form delivery provider</h2><p>The current website sends inquiry form data through FormSubmit. Submission therefore involves that third-party service. Its activation status, data retention and production configuration require final company confirmation.</p>
        <h2>Cookies and analytics</h2><p>No analytics or advertising platform is intentionally initialized by the code added in this optimization. A future <code>generate_lead</code> event hook is reserved but does not send data until a measurement system is configured. Hosting providers may process technical request logs; the production hosting configuration must be confirmed.</p>
        <h2>Retention and access</h2><p>Retention periods, internal recipients and any cross-border data handling require company confirmation. You may contact the company to request access, correction or deletion where applicable.</p>
        <h2>Contact</h2><p>Questions about this notice can be sent to <a href={`mailto:${company.email}`}>{company.email}</a>.</p>
        <aside className="marketing-legal-note">Publication status: company confirmation and qualified legal review are still required for the legal entity details, applicable regions, retention periods, FormSubmit settings, hosting logs, recipients and rights-request process.</aside>
      </div></section>
    </MarketingPage>
  );
}
