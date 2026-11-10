import fs from "node:fs";
import path from "node:path";
import HomeInteractions from "./HomeInteractions";
import "./homepage.css";

export const dynamic = "force-static";

export const metadata = {
  title: { absolute: "China Cargo Operations & USA Delivery | GOOD LOGISTICS" },
  description:
    "Supplier pickup, consolidation, warehousing, FBA prep, labeling, repacking, kitting and China-to-USA freight with final-delivery coordination.",
  alternates: {
    canonical: "https://gdlogi.us/"
  },
  openGraph: {
    title: "From China Suppliers to Final Delivery | GOOD LOGISTICS",
    description:
      "China-side pickup, receiving, storage, prep and consolidation coordinated with freight, customs clearance and final delivery to the United States.",
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
    title: "From China Suppliers to Final Delivery | GOOD LOGISTICS",
    description: "China-side cargo operations coordinated with international freight and final delivery to the United States.",
    images: ["/good-shipping-homepage/assets/good-logistics-logo.png"]
  }
};

const faqItems = [
  ["Can you collect cargo from multiple suppliers?", "Yes. Supplier locations, cargo-ready dates, packing lists and release instructions are reviewed before a combined pickup and consolidation plan is confirmed."],
  ["Can you apply FNSKU and outer-carton labels?", "Yes. Labeling can be arranged using the final files and placement instructions confirmed by the customer. Current platform requirements still need shipment-specific verification."],
  ["Is receiving the same as a product-quality inspection?", "No. Standard receiving can cover package quantity, outer cartons, labels and visible damage. Product checks, sampling and acceptance criteria must be scoped separately."],
  ["Can you store and release cargo in stages?", "Temporary storage and planned releases can be coordinated after the cargo, expected duration, inventory record and release instructions are confirmed."],
  ["Do you handle oversized cargo and U.S. island destinations?", "Yes, subject to review of packed cargo data, routing, equipment, access and final-delivery conditions for the confirmed address."]
];

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://gdlogi.us/#organization",
      name: "GOOD LOGISTICS",
      legalName: "Good Logistics Co., Ltd.",
      alternateName: "深圳市谷得供应链有限公司",
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
      areaServed: { "@type": "Country", name: "United States" },
      description: "Supplier pickup, receiving checks, warehousing, consolidation, labeling, repacking and kitting coordinated with international freight, customs clearance and final delivery to the United States."
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
