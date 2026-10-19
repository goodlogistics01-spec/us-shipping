import MarketingPage, { Breadcrumbs } from "../components/MarketingPage";
import QuoteForm from "../components/QuoteForm";
import { createPageMetadata } from "../site-data";

export const metadata = createPageMetadata({
  title: "Get a China to USA Shipping Quote | Good Logistics",
  description: "Share your cargo, origin and U.S. delivery details for a China to USA freight shipping plan and quotation.",
  path: "/quote/"
});

export default function QuotePage() {
  return (
    <MarketingPage>
      <section className="marketing-page-hero marketing-quote-hero"><div className="marketing-container marketing-content-narrow"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Quote" }]} /><p className="marketing-eyebrow">Shipping Review</p><h1>Get a China to USA Shipping Quote</h1><p className="marketing-lead">Share the details that affect routing, handling, customs scope and final delivery. The team can then recommend a suitable plan based on cost, timing and delivery requirements.</p></div></section>
      <section className="marketing-section"><div className="marketing-container marketing-form-shell"><QuoteForm /></div></section>
    </MarketingPage>
  );
}
