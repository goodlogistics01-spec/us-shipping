import { notFound } from "next/navigation";
import MarketingPage, { Breadcrumbs, JsonLd } from "../../components/MarketingPage";
import OceanFreightPage from "../../components/OceanFreightPage";
import { company, services } from "../../site-data";

function createQuoteHref(service) {
  const params = new URLSearchParams();
  if (service.category !== "China Operations") {
    params.set("destination_country", "United States");
  }
  if (service.shippingMethod) params.set("shipping_method", service.shippingMethod);
  service.quoteNeeds.forEach((need) => params.append("service_need", need));
  (service.quoteInspectionTypes || []).forEach((type) => {
    params.append("inspection_type", type);
  });
  return `/quote/?${params.toString()}`;
}

function createWhatsappHref(service) {
  const text = `Hello Zoe, I'd like to discuss ${service.navTitle.toLowerCase()} for my cargo.`;
  return `${company.whatsappHref}?text=${encodeURIComponent(text)}`;
}

function serviceAreaServed(service) {
  if (service.category === "China Operations") {
    return { "@type": "Country", name: "China" };
  }
  if (service.category === "China Operations & International Delivery") {
    return [
      { "@type": "Country", name: "China" },
      { "@type": "Country", name: "United States" }
    ];
  }
  return [
    { "@type": "Country", name: "China" },
    { "@type": "Country", name: "United States" }
  ];
}

function ResponsiveOperationPhoto({ media, eager = false, sizes = "(max-width: 1023px) 100vw, 44vw" }) {
  const srcSet = (extension) => media.widths
    .map((width) => `${media.base}-${width}.${extension} ${width}w`)
    .join(", ");

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        src={`${media.base}-${media.fallbackWidth}.jpg`}
        alt={media.alt}
        width={media.width}
        height={media.height}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
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
  const socialImage = service.heroMedia
    ? `${service.heroMedia.base}-${service.heroMedia.fallbackWidth}.jpg`
    : "/good-shipping-homepage/assets/good-logistics-logo.png";

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
      images: [socialImage]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage]
    }
  };
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) notFound();

  const url = `${company.website}/services/${slug}/`;
  const quoteHref = createQuoteHref(service);
  const whatsappHref = createWhatsappHref(service);
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
        areaServed: serviceAreaServed(service),
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
                <a className="marketing-button marketing-button-primary" href={quoteHref} data-quote-location="service_hero">
                  Get a Shipping Quote
                </a>
                <a
                  className="marketing-button marketing-button-secondary"
                  href={whatsappHref}
                >
                  Chat with Zoe on WhatsApp
                </a>
              </div>
            </div>
            {service.heroMedia ? (
              <figure className="marketing-service-media">
                <ResponsiveOperationPhoto media={service.heroMedia} eager />
                <figcaption>{service.heroMedia.caption}</figcaption>
              </figure>
            ) : (
              <aside className="marketing-hero-brief" aria-label={`${service.navTitle} planning summary`}>
                <img
                  src="/good-shipping-homepage/assets/good-logistics-logo.png"
                  alt="GOOD LOGISTICS"
                  width="520"
                  height="270"
                />
                <p>China <span aria-hidden="true">→</span> your destination</p>
                <ul>
                  <li>{service.category}</li>
                  <li>One contact for shipment planning</li>
                  <li>Updates at the agreed milestones</li>
                </ul>
              </aside>
            )}
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Best Fit</p>
            <h2>Who this service is for</h2>
            <ul className="marketing-check-list">
              {service.bestFor.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="marketing-eyebrow">What We Do</p>
            <h2>Operations available for your cargo</h2>
            <ul className="marketing-check-list">
              {service.operations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {service.supportingMedia ? (
        <section className="marketing-section marketing-operation-feature">
          <div className="marketing-container marketing-operation-feature-grid">
            <figure>
              <ResponsiveOperationPhoto media={service.supportingMedia} sizes="(max-width: 700px) 100vw, 52vw" />
            </figure>
            <div>
              <p className="marketing-eyebrow">In Practice</p>
              <h2>{service.supportingMedia.title}</h2>
              <p>{service.supportingMedia.copy}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="marketing-section marketing-soft-section">
        <div className="marketing-container marketing-two-column">
          <div>
            <p className="marketing-eyebrow">Shipment Details</p>
            <h2>What affects the plan</h2>
            <ul className="marketing-check-list">
              {service.boundaries.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="marketing-eyebrow">What To Send</p>
            <h2>Information needed for a useful quote</h2>
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
            <h2>What influences your quote</h2>
            <ul className="marketing-check-list">
              {service.costFactors.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p className="marketing-eyebrow">Next Steps</p>
            <h2>Start with the details you have</h2>
            <ol className="marketing-step-list">
              {service.startSteps.map((item, index) => (
                <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>
              ))}
            </ol>
          </div>
        </div>
        {service.resourceLink ? (
          <div className="marketing-container">
            <aside className="marketing-resource-callout">
              <div>
                <p className="marketing-eyebrow">Preparation Guide</p>
                <h3>{service.resourceLink.title}</h3>
                <p>{service.resourceLink.copy}</p>
              </div>
              <a className="marketing-button marketing-button-secondary" href={service.resourceLink.href}>Open the checklist</a>
            </aside>
          </div>
        ) : null}
      </section>

      <section className="marketing-section marketing-soft-section">
        <div className="marketing-container">
          <p className="marketing-eyebrow">Continue Planning</p>
          <h2>Related services</h2>
          <div className="marketing-card-grid">
            {service.relatedServices.map(([title, href]) => (
              <article className="marketing-content-card" key={href}>
                <h2>{title}</h2>
                <p>See how this service can connect with the rest of your shipment.</p>
                <a className="marketing-text-link" href={href}>View service →</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section">
        <div className="marketing-container marketing-content-narrow">
          <p className="marketing-eyebrow">Frequently Asked Questions</p>
          <h2>Common questions</h2>
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
            <h2>Ready to plan your shipment?</h2>
            <p>Send your product, weight or dimensions, pickup location and delivery address. We can clarify the remaining details with you.</p>
          </div>
          <a className="marketing-button marketing-button-primary" href={quoteHref} data-quote-location="service_footer">Get a Shipping Quote</a>
        </div>
      </section>
    </MarketingPage>
  );
}
