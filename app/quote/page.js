import MarketingPage, { PageHero } from "../components/MarketingPage";
import QuoteForm from "../components/QuoteForm";
import { createPageMetadata } from "../site-data";

export const metadata = createPageMetadata({
  title: "Get a Shipping Quote from China | GOOD LOGISTICS",
  description: "Request China-side pickup, consolidation, cargo preparation and international ocean, air or express freight in one form.",
  path: "/quote/"
});

export default function QuotePage() {
  return (
    <MarketingPage>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Quote" }]}
        eyebrow="Shipping Quote"
        title="Get a Shipping Quote"
        lead="Start with the product, pickup city and destination. Unknown weight or dimensions are fine."
        variant="compact"
      />
      <section className="marketing-section marketing-quote-form-section"><div className="marketing-container marketing-form-shell"><QuoteForm replyFieldsNearEmail /></div></section>
    </MarketingPage>
  );
}
