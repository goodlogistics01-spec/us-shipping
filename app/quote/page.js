import MarketingPage, { Breadcrumbs } from "../components/MarketingPage";
import QuoteForm from "../components/QuoteForm";
import { createPageMetadata } from "../site-data";

export const metadata = createPageMetadata({
  title: "Shipping & Cargo Prep Quote | GOOD LOGISTICS",
  description: "Request China-side pickup, consolidation, warehousing, FBA prep, repacking, kitting, receiving checks, scoped product inspection and China-to-USA freight in one form.",
  path: "/quote/"
});

export default function QuotePage() {
  return (
    <MarketingPage>
      <section className="marketing-page-hero marketing-quote-hero"><div className="marketing-container marketing-content-narrow"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Quote" }]} /><p className="marketing-eyebrow">Shipping &amp; Prep Quote</p><h1>Tell Us About Your Shipment</h1><p className="marketing-lead">Share the essentials. We’ll confirm the remaining shipping and cargo-prep details with you.</p></div></section>
      <section className="marketing-section"><div className="marketing-container marketing-form-shell"><QuoteForm replyFieldsNearEmail /></div></section>
    </MarketingPage>
  );
}
