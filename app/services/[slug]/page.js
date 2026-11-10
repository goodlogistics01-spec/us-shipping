import { notFound } from "next/navigation";
import MarketingPage, { Breadcrumbs, JsonLd } from "../../components/MarketingPage";
import OceanFreightPage from "../../components/OceanFreightPage";
import { company, services } from "../../site-data";

function createQuoteHref(service) {
  const params = new URLSearchParams();
  if (service.shippingMethod) params.set("shipping_method", service.shippingMethod);
  service.quoteNeeds.forEach((need) => params.append("service_need", need));
  return `/quote/?${params.toString()}`;
}

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
    : `${service.title} | GOOD LOGISTICS`;
  const description = isSeaFreight
    ? "Sea freight from China to the USA with FCL, LCL, factory pickup, customs coordination and final delivery options. Request a quote from GOOD LOGISTICS."
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
      images: ["/good-shipping-homepage/assets/good-logistics-logo.png"]
    },
    twitter: isSeaFreight ? {
      card: "summary_large_image",
      title,
      description,
      images: ["/good-shipping-homepage/assets/good-logistics-logo.png"]
    } : undefined
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) notFound();

  const url = `${company.website}/services/${slug}/`;
  const quoteHref = createQuoteHref(service);
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
              <p className="marketing-eyebrow">{service.eyebrow}</p>
              <h1>{service.title}</h1>
              <p className="marketing-lead">{service.summary}</p>
              <div className="marketing-actions">
                <a className="marketing-button marketing-button-primary" href={quoteHref}>
                  Request a Shipping &amp; Prep Quote
                </a>
                <a className="marketing-button marketing-button-secondary" href="/#services">
                  Compare Services
                </a>
              </div>
            </div>
            <aside className="marketing-hero-brief" aria-label={`${service.navTitle} planning summary`}>
              <img
                src="/good-shipping-homepage/assets/good-logistics-logo.png"
                alt="GOOD LOGISTICS"
                width="520"
                height="270"
              />
              <p>China <span aria-hidden="true">→</span> United States</p>
              <ul>
                <li>{service.category}</li>
                <li>Scope confirmed before work starts</li>
                <li>Progress updates at agreed milestones</li>
              </ul>
            </aside>
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
            <p className="marketing-eyebrow">Specific Operations</p>
            <h2>What Good Logistics can coordinate</h2>
            <ul className="marketing-check-list">
              {service.operations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-soft-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Service Boundaries</p>
            <h2>What is confirmed separately</h2>
            <ul className="marketing-check-list">
              {service.boundaries.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="marketing-eyebrow">Customer Inputs</p>
            <h2>What to provide for a useful review</h2>
            <ul className="marketing-check-list">
              {service.customerInputs.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Cost Factors</p>
            <h2>What influences the quotation</h2>
            <ul className="marketing-check-list">
              {service.costFactors.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="marketing-eyebrow">How to Start</p>
            <h2>Move from details to an agreed scope</h2>
            <ol className="marketing-step-list">
              {service.startSteps.map((item, index) => (
                <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="marketing-section marketing-soft-section">
        <div className="marketing-container">
          <p className="marketing-eyebrow">Related Services</p>
          <h2>Build the shipment around the actual work required</h2>
          <div className="marketing-card-grid">
            {service.relatedServices.map(([title, href]) => (
              <article className="marketing-content-card" key={href}>
                <h2>{title}</h2>
                <p>Review this service together with the cargo, supplier and delivery requirements.</p>
                <a className="marketing-text-link" href={href}>View service →</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section">
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
            <h2>Need a shipment and handling plan?</h2>
            <p>Send the cargo, supplier, operation and destination details needed for a scope-based quotation.</p>
          </div>
          <a className="marketing-button marketing-button-primary" href={quoteHref}>Request a Shipping &amp; Prep Quote</a>
        </div>
      </section>
    </MarketingPage>
  );
}
