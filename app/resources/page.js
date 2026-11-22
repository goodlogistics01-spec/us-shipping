import MarketingPage, { PageHero } from "../components/MarketingPage";
import { createPageMetadata, resourceArticles } from "../site-data";

export const metadata = createPageMetadata({
  title: "Shipping Resources for Importers | GOOD LOGISTICS",
  description: "Practical resources for buyers planning supplier consolidation, freight and delivery from China.",
  path: "/resources/"
});

export default function ResourcesPage() {
  return (
    <MarketingPage>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
        eyebrow="Importer Resources"
        title="Practical Guides for Shipping from China"
        lead="Use these guides to prepare cargo details, compare options and ask clearer questions before booking."
        variant="compact"
      />
      <section className="marketing-section">
        <div className="marketing-container marketing-card-grid">
          {resourceArticles.map((article) => (
            <article className="marketing-content-card" key={article.href}>
              <p className="marketing-eyebrow">Shipping Guide</p>
              <h2>{article.title}</h2>
              <p>{article.description}</p>
              <a className="marketing-text-link" href={article.href}>{article.ctaLabel}</a>
            </article>
          ))}
        </div>
      </section>
    </MarketingPage>
  );
}
