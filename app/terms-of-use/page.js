import MarketingPage, { Breadcrumbs } from "../components/MarketingPage";
import { createPageMetadata } from "../site-data";

export const metadata = createPageMetadata({
  title: "Terms of Use | Good Logistics",
  description: "Website terms for Good Logistics information and shipping inquiries.",
  path: "/terms-of-use/"
});

export default function TermsPage() {
  return (
    <MarketingPage>
      <section className="marketing-page-hero"><div className="marketing-container marketing-content-narrow"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]} /><p className="marketing-eyebrow">Website Information</p><h1>Terms of Use</h1><p className="marketing-lead">Important limits that apply when using this website and requesting shipment information.</p></div></section>
      <section className="marketing-section"><div className="marketing-container marketing-legal-copy">
        <h2>General information</h2><p>The website provides general information about freight-forwarding and shipment-planning services. Content is not a binding quotation, customs ruling, legal opinion, insurance commitment or guaranteed transit schedule.</p>
        <h2>Quotation scope</h2><p>A shipment can be accepted only after cargo details, commodity, value, origin, destination, packaging, timing, customs requirements and delivery conditions are reviewed. The final written quotation or service agreement controls the agreed scope.</p>
        <h2>Accuracy and changes</h2><p>Routes, schedules, rates, carrier capacity, customs requirements and delivery conditions can change. Users should request current information for a specific shipment.</p>
        <h2>User responsibilities</h2><p>Users are responsible for providing accurate cargo and contact details, identifying regulated or dangerous goods and obtaining professional advice where required.</p>
        <h2>Intellectual property and third-party services</h2><p>Company branding and original website content may not be misrepresented. Links and form providers operated by third parties are subject to their own terms.</p>
      </div></section>
    </MarketingPage>
  );
}
