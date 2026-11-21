import MarketingPage, { Breadcrumbs } from "../components/MarketingPage";
import QuoteForm from "../components/QuoteForm";
import { createPageMetadata } from "../site-data";

export const metadata = createPageMetadata({
  title: "Get a China to USA Shipping Quote | GOOD LOGISTICS",
  description: "Request China-side pickup, consolidation, warehousing, FBA prep, repacking, kitting, receiving checks, scoped product inspection and China-to-USA freight in one form.",
  path: "/quote/"
});

export default function QuotePage() {
  return (
    <MarketingPage>
      <section className="marketing-page-hero marketing-quote-hero"><div className="marketing-container marketing-content-narrow"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Quote" }]} /><p className="marketing-eyebrow">China to USA Quote</p><h1>Start Your Quote</h1><p className="marketing-lead">Tell us what you are shipping and where it needs to go.</p></div></section>
      <section className="marketing-section marketing-quote-form-section"><div className="marketing-container marketing-form-shell"><QuoteForm replyFieldsNearEmail /></div></section>
    </MarketingPage>
  );
}
