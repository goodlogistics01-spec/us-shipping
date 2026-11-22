import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="marketing-breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={item.href || item.label}>
          {index > 0 && <span aria-hidden="true"> / </span>}
          {item.href ? <a href={item.href}>{item.label}</a> : item.label}
        </span>
      ))}
    </nav>
  );
}

export function PageHero({ breadcrumbs, title, lead, eyebrow, variant = "default", children }) {
  const classes = ["marketing-page-hero", `marketing-page-hero-${variant}`].join(" ");
  return (
    <section className={classes}>
      <div className="marketing-container marketing-content-narrow">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        {eyebrow && <p className="marketing-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="marketing-lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export default function MarketingPage({ children, headerContext = "site" }) {
  return (
    <>
      <SiteHeader context={headerContext} />
      <main className="marketing-main">{children}</main>
      <SiteFooter />
    </>
  );
}
