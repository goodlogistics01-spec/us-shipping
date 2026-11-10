import MarketingPage from "../components/MarketingPage";
import { createPageMetadata } from "../site-data";
import { cookies } from "next/headers";

export const metadata = {
  ...createPageMetadata({
    title: "Inquiry Received | Good Logistics",
    description: "Confirmation page for a Good Logistics shipping inquiry submitted through the website.",
    path: "/thank-you/"
  }),
  robots: { index: false, follow: true }
};

export default async function ThankYouPage() {
  const inquiryAccepted = (await cookies()).has("gdlogi_inquiry_accepted");

  return (
    <MarketingPage>
      <section className="marketing-page-hero marketing-thank-you">
        <div className="marketing-container marketing-content-narrow">
          <p className="marketing-eyebrow">Inquiry Status</p>
          {inquiryAccepted ? (
            <>
              <h1>We’ve received your shipment details.</h1>
              <p className="marketing-lead">Your inquiry was accepted for delivery to the Good Logistics team. Keep your cargo dimensions, weight, packing list and destination details available for follow-up.</p>
            </>
          ) : (
            <>
              <h1>No confirmed inquiry found</h1>
              <p className="marketing-lead">This page confirms an inquiry only after the website receives a successful response from the delivery provider. Please return to the quote form or contact us directly.</p>
            </>
          )}
          <div className="marketing-actions">
            <a className="marketing-button marketing-button-primary" href={inquiryAccepted ? "/" : "/quote/"}>
              {inquiryAccepted ? "Return to Home" : "Open the Quote Form"}
            </a>
            <a className="marketing-button marketing-button-secondary" href="mailto:zoe@gdlogi.com">Email the Team</a>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
