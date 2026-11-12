import MarketingPage, { Breadcrumbs } from "../components/MarketingPage";
import { createPageMetadata, resourceArticles } from "../site-data";

export const metadata = createPageMetadata({
  title: "China to USA Shipping Resources | Good Logistics",
  description: "Practical resources for U.S. importers planning freight, DDP, oversized cargo and supplier consolidation from China.",
  path: "/resources/"
});

export default function ResourcesPage() {
  return (
    <MarketingPage>
      <section className="marketing-page-hero">
        <div className="marketing-container marketing-content-narrow">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resources" }]} />
          <p className="marketing-eyebrow">Importer Resource Center</p>
          <h1>China to USA Freight Planning Resources</h1>
          <p className="marketing-lead">Practical questions, checklists and scope notes for importers comparing shipping plans.</p>
        </div>
      </section>
      <section className="marketing-section">
        <div className="marketing-container marketing-card-grid">
          {resourceArticles.map((article) => (
            <article className="marketing-content-card" key={article.href}>
              <p className="marketing-eyebrow">Service Planning</p>
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
