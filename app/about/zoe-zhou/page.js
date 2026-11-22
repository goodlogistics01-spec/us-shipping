import MarketingPage, { Breadcrumbs, JsonLd } from "../../components/MarketingPage";
import { company, createPageMetadata, resourceArticles } from "../../site-data";

export const metadata = createPageMetadata({
  title: "Zoe Zhou | Director of International Logistics",
  description: "Contact Zoe Zhou at GOOD LOGISTICS for China cargo operations and international freight planning.",
  path: "/about/zoe-zhou/",
  image: "/good-shipping-homepage/assets/authors/zoe-zhou-headshot.jpg"
});

export default function ZoeZhouPage() {
  const url = `${company.website}/about/zoe-zhou/`;
  return (
    <MarketingPage>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ProfilePage", url, mainEntity: { "@type": "Person", name: "Zoe Zhou", jobTitle: "Director of International Logistics", worksFor: { "@type": "Organization", name: company.name, url: company.website }, image: `${company.website}/good-shipping-homepage/assets/authors/zoe-zhou-headshot.jpg`, url } }} />
      <section className="marketing-page-hero">
        <div className="marketing-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About", href: "/about/" }, { label: "Zoe Zhou" }]} />
          <div className="marketing-profile-grid">
            <picture>
              <source srcSet="/good-shipping-homepage/assets/authors/zoe-zhou-headshot-640.avif" type="image/avif" />
              <img src="/good-shipping-homepage/assets/authors/zoe-zhou-headshot.jpg" alt="Upper-body portrait of Zoe Zhou, Director of International Logistics at Good Logistics" width="640" height="904" decoding="async" />
            </picture>
            <div>
              <p className="marketing-eyebrow">Logistics Contact</p>
              <h1>Zoe Zhou</h1>
              <p className="marketing-role">Director of International Logistics</p>
              <p className="marketing-lead">Zoe helps buyers connect supplier pickup and cargo preparation in China with ocean, air or express freight to the USA and other major markets.</p>
              <div className="marketing-actions">
                <a className="marketing-button marketing-button-primary" href="/quote/">Get a Shipping Quote</a>
                <a className="marketing-button marketing-button-secondary" href={company.whatsappHref}>Chat on WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="marketing-section">
        <div className="marketing-container marketing-two-column">
          <div><h2>Primary focus areas</h2><ul className="marketing-check-list"><li>Ocean, air and express freight planning</li><li>Supplier pickup and consolidation</li><li>Labeling, repacking, kitting and receiving checks</li><li>Oversized cargo requirements</li><li>Destination and final-delivery planning</li></ul></div>
          <div><h2>Planning resources</h2><div className="marketing-link-list">{resourceArticles.slice(0, 3).map((article) => <a key={article.href} href={article.href}>{article.title}</a>)}</div></div>
        </div>
      </section>
    </MarketingPage>
  );
}
