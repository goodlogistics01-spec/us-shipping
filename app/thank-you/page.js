import MarketingPage from "../components/MarketingPage";
import { createPageMetadata } from "../site-data";

export const metadata = {
  ...createPageMetadata({
    title: "Inquiry Received | Good Logistics",
    description: "Confirmation page for a Good Logistics shipping inquiry submitted through the website.",
    path: "/thank-you/"
  }),
  robots: { index: false, follow: true }
};

export default function ThankYouPage() {
  return (
    <MarketingPage>
      <section className="marketing-page-hero marketing-thank-you"><div className="marketing-container marketing-content-narrow"><p className="marketing-eyebrow">Inquiry Status</p><h1>Thank you for sharing your shipment details</h1><p className="marketing-lead">If the form provider accepted the submission, the information has been forwarded for review. Keep your cargo dimensions, weight, packing list and destination details available for follow-up.</p><div className="marketing-actions"><a className="marketing-button marketing-button-primary" href="/">Return to Home</a><a className="marketing-button marketing-button-secondary" href="mailto:zoe@gdlogi.com">Email the Team</a></div></div></section>
    </MarketingPage>
  );
}
