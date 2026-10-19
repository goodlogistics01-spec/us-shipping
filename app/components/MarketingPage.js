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

export default function MarketingPage({ children }) {
  return (
    <>
      <SiteHeader />
      <main className="marketing-main">{children}</main>
      <SiteFooter />
    </>
  );
}
