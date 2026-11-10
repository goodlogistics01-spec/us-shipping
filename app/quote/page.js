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
      <section className="marketing-page-hero marketing-quote-hero"><div className="marketing-container marketing-content-narrow"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Quote" }]} /><p className="marketing-eyebrow">Shipping &amp; China-Side Operations</p><h1>Request a Shipping &amp; Prep Quote</h1><p className="marketing-lead">Select shipping separately from pickup, consolidation, warehousing, labeling, repacking, kitting, receiving checks or project-scoped product inspection. Unknown weight or volume can be marked for follow-up.</p></div></section>
      <section className="marketing-section"><div className="marketing-container marketing-form-shell"><QuoteForm /></div></section>
    </MarketingPage>
  );
}
