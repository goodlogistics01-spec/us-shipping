import { notFound } from "next/navigation";
import MarketingPage, { Breadcrumbs, JsonLd } from "../../components/MarketingPage";
import OceanFreightPage from "../../components/OceanFreightPage";
import { company, services } from "../../site-data";

export function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) return {};

  const url = `${company.website}/services/${slug}/`;
  const isSeaFreight = slug === "sea-freight-china-to-usa";
  const title = isSeaFreight
    ? "Sea Freight from China to USA | FCL, LCL & Door Delivery"
    : `${service.title} | Good Logistics`;
  const description = isSeaFreight
    ? "Sea freight from China to the USA with FCL, LCL, factory pickup, customs coordination and final delivery options. Get a quote from Good Logistics."
    : service.description;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: company.name,
      type: "website",
      images: ["/good-shipping-homepage/assets/crane-truck-warehouse.jpg"]
    },
    twitter: isSeaFreight ? {
      card: "summary_large_image",
      title,
      description,
      images: ["/good-shipping-homepage/assets/crane-truck-warehouse.jpg"]
    } : undefined
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) notFound();

  const url = `${company.website}/services/${slug}/`;
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: service.navTitle }
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.title,
        description: service.description,
        url,
        provider: { "@type": "Organization", name: company.name, url: company.website },
        areaServed: { "@type": "Country", name: "United States" },
        serviceType: service.navTitle
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: item.href ? `${company.website}${item.href}` : url
        }))
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer }
        }))
      }
    ]
  };

  if (slug === "sea-freight-china-to-usa") {
    return <OceanFreightPage service={service} schema={schema} />;
  }

  return (
    <MarketingPage>
      <JsonLd data={schema} />
      <section className="marketing-hero marketing-service-hero">
        <div className="marketing-container">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="marketing-hero-grid">
            <div>
              <p className="marketing-eyebrow">China to USA Freight Service</p>
              <h1>{service.title}</h1>
              <p className="marketing-lead">{service.summary}</p>
              <div className="marketing-actions">
                <a className="marketing-button marketing-button-primary" href="/quote/">
                  Get a Shipping Quote
                </a>
                <a className="marketing-button marketing-button-secondary" href="/#services">
                  Compare Services
                </a>
              </div>
            </div>
            <picture>
              <source srcSet="/good-shipping-homepage/assets/crane-truck-warehouse-1400.avif" type="image/avif" />
              <img
                className="marketing-hero-image"
                src="/good-shipping-homepage/assets/crane-truck-warehouse.jpg"
                alt="Crane truck and packed cargo during logistics handling"
                width="1706"
                height="1279"
                fetchPriority="high"
              />
            </picture>
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Best Fit</p>
            <h2>When this service may fit</h2>
            <ul className="marketing-check-list">
              {service.bestFor.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="marketing-eyebrow">Planning Workflow</p>
            <h2>What we review before cargo moves</h2>
            <ol className="marketing-step-list">
              {service.plan.map((item, index) => (
                <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-soft-section">
        <div className="marketing-container marketing-content-narrow">
          <p className="marketing-eyebrow">Frequently Asked Questions</p>
          <h2>Questions to settle before booking</h2>
          <div className="marketing-faq-list">
            {service.faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-cta">
        <div className="marketing-container marketing-cta-inner">
          <div>
            <h2>Need a route-specific shipping plan?</h2>
            <p>Send the cargo, pickup and delivery details needed for a scope-based quotation.</p>
          </div>
          <a className="marketing-button marketing-button-primary" href="/quote/">Get a Shipping Quote</a>
        </div>
      </section>
    </MarketingPage>
  );
}
