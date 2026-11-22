import fs from "node:fs";
import path from "node:path";
import HomeInteractions from "./HomeInteractions";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import "./homepage.css";

export const dynamic = "force-static";

export const metadata = {
  title: { absolute: "Freight Forwarding from China | GOOD LOGISTICS" },
  description:
    "Ocean, air and express freight from China with supplier pickup, consolidation, cargo preparation and delivery to the USA and other major markets.",
  alternates: {
    canonical: "https://gdlogi.us/"
  },
  openGraph: {
    title: "Freight Forwarding from China | GOOD LOGISTICS",
    description:
      "Supplier pickup, consolidation and cargo preparation coordinated with ocean, air or express freight and final delivery.",
    url: "https://gdlogi.us/",
    siteName: "GOOD LOGISTICS",
    type: "website",
    images: [
      {
        url: "/good-shipping-homepage/assets/brand/container-ship-hero-desktop-1600.jpg",
        width: 1600,
        height: 900,
        alt: "Container ship crossing calm coastal water"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Freight Forwarding from China | GOOD LOGISTICS",
    description: "Ocean, air and express freight with China-side cargo coordination and international delivery.",
    images: ["/good-shipping-homepage/assets/brand/container-ship-hero-desktop-1600.jpg"]
  }
};

const faqItems = [
  ["Can you collect cargo from multiple suppliers?", "Yes. Send each pickup location, ready date and packing list. We can plan one shipment or staged releases for compatible cargo."],
  ["Are receiving checks the same as product inspection?", "No. Receiving checks cover agreed package quantities, outer cartons, labels and visible damage. Product inspection needs a separate checklist, sampling method and report."],
  ["Which destinations can you quote?", "We quote shipments from China to the USA, Canada, the UK, Europe, Australia and New Zealand. U.S. planning also includes Hawaii, Alaska and Puerto Rico."],
  ["What should I send first?", "Send the product, pickup location, delivery address and any known weight or dimensions. Unknown details can be confirmed with you."]
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
      name: "China Freight Forwarding and Cargo Coordination",
      serviceType: "Cargo handling and international freight coordination",
      provider: { "@id": "https://gdlogi.us/#organization" },
      areaServed: [
        { "@type": "Country", name: "China" },
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "Canada" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Place", name: "Europe" },
        { "@type": "Country", name: "Australia" },
        { "@type": "Country", name: "New Zealand" }
      ],
      description: "Supplier pickup, receiving checks, warehousing, consolidation, labeling, repacking and kitting coordinated with ocean, air or express freight, customs-broker handoffs and final delivery."
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
      <SiteHeader context="home" />
      <div dangerouslySetInnerHTML={{ __html: body }} />
      <HomeInteractions />
      <SiteFooter />
    </>
  );
}
