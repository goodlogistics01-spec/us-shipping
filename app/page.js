import fs from "node:fs";
import path from "node:path";
import HomeInteractions from "./HomeInteractions";
import "./homepage.css";

export const dynamic = "force-static";

export const metadata = {
  title: { absolute: "China to USA Freight & Cargo Coordination | GOOD LOGISTICS" },
  description:
    "China to USA ocean, air and express freight with supplier pickup, consolidation, cargo prep, customs-broker handoffs and final-delivery coordination.",
  alternates: {
    canonical: "https://gdlogi.us/"
  },
  openGraph: {
    title: "China to USA Shipping, From Pickup to Delivery | GOOD LOGISTICS",
    description:
      "Supplier pickup, receiving, consolidation and prep coordinated with ocean, air or express freight and final delivery to the United States.",
    url: "https://gdlogi.us/",
    siteName: "GOOD LOGISTICS",
    type: "website",
    images: [
      {
        url: "/good-shipping-homepage/assets/good-logistics-logo.png",
        width: 520,
        height: 270,
        alt: "GOOD LOGISTICS"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "China to USA Shipping, From Pickup to Delivery | GOOD LOGISTICS",
    description: "China-side cargo operations coordinated with ocean, air or express freight and final delivery to the United States.",
    images: ["/good-shipping-homepage/assets/good-logistics-logo.png"]
  }
};

const faqItems = [
  ["Can you collect cargo from multiple suppliers?", "Yes. Share each pickup location, cargo-ready date and packing list. We can plan one combined shipment or staged releases where cargo is compatible."],
  ["Can you apply FNSKU and outer-carton labels?", "Yes. We apply customer-approved label files and placement instructions. Platform requirements must be checked for the destination market."],
  ["Is receiving the same as a product-quality inspection?", "No. Receiving checks cover quantity, outer cartons, labels and visible damage. Product-quality inspection needs agreed sampling, criteria and reporting."],
  ["Can you store and release cargo in stages?", "Yes. Share the expected storage period, cargo details and release schedule. Availability and handling are quoted for the shipment."],
  ["Do you handle oversized cargo and U.S. island destinations?", "Yes. Send packed dimensions, weight, ZIP code and unloading or access needs. We will identify available routing and equipment for the address."]
];

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://gdlogi.us/#organization",
      name: "GOOD LOGISTICS",
      alternateName: ["Good Logistics Co., Ltd.", "深圳市谷得供应链有限公司"],
      url: "https://gdlogi.us/",
      logo: "https://gdlogi.us/good-shipping-homepage/assets/good-logistics-logo.png"
    },
    {
      "@type": "WebSite",
      "@id": "https://gdlogi.us/#website",
      url: "https://gdlogi.us/",
      name: "GOOD LOGISTICS",
      publisher: { "@id": "https://gdlogi.us/#organization" },
      inLanguage: "en-US"
    },
    {
      "@type": "Service",
      "@id": "https://gdlogi.us/#china-operations-and-delivery",
      name: "China-Side Cargo Operations and China-to-USA Delivery",
      serviceType: "Cargo handling and international freight coordination",
      provider: { "@id": "https://gdlogi.us/#organization" },
      areaServed: [
        { "@type": "Country", name: "China" },
        { "@type": "Country", name: "United States" }
      ],
      description: "Supplier pickup, receiving checks, warehousing, consolidation, labeling, repacking and kitting coordinated with ocean, air or express freight, customs-broker handoffs and final delivery to the United States."
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer }
      }))
    }
  ]
};

export default function Home() {
  const htmlPath = path.join(process.cwd(), "content", "good-logistics-homepage-v2.html");
  const body = fs.readFileSync(htmlPath, "utf8");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
      <HomeInteractions />
    </>
  );
}
