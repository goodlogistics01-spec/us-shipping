import fs from "node:fs";
import path from "node:path";
import HomeInteractions from "./HomeInteractions";
import "./homepage.css";

export const dynamic = "force-static";

export const metadata = {
  title: { absolute: "China to USA Freight Forwarder | Good Logistics" },
  description:
    "Freight forwarding from China to the USA by sea, air and DDP. Supplier pickup, consolidation, Amazon FBA, oversized cargo and final delivery across the United States.",
  alternates: {
    canonical: "https://gdlogi.us/"
  },
  openGraph: {
    title: "China to USA Freight Forwarder | Good Logistics",
    description:
      "Sea, air and DDP freight from supplier pickup in China to final delivery across the United States.",
    url: "https://gdlogi.us/",
    siteName: "Good Logistics Co., Ltd.",
    type: "website",
    images: [
      {
        url: "/good-shipping-homepage/assets/crane-truck-warehouse.jpg",
        width: 1706,
        height: 1279,
        alt: "Crane truck and packed cargo during logistics handling"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "China to USA Freight Forwarder | Good Logistics",
    description: "Sea, air and DDP freight from supplier pickup in China to U.S. final delivery.",
    images: ["/good-shipping-homepage/assets/crane-truck-warehouse.jpg"]
  }
};

const faqItems = [
  ["How much does shipping from China to the USA cost?", "Cost depends on the commodity, package count, dimensions, weight, origin, destination ZIP code, shipping method, customs scope and delivery conditions."],
  ["How long does sea freight from China to the USA take?", "The complete timeline depends on pickup, sailing schedule, port pair, customs and final delivery. Request a current route-specific estimate rather than relying on a fixed promise."],
  ["Do you provide DDP door-to-door shipping?", "DDP can be reviewed when the commodity, value, importer requirements and exact delivery scope are confirmed."],
  ["Can you collect cargo from multiple suppliers?", "Yes. Supplier locations, cargo-ready dates, packages and documents are reviewed before confirming a consolidation plan."],
  ["Can you ship oversized machinery or furniture?", "Oversized cargo can be planned after exact packed dimensions, weights, handling photos, access and unloading requirements are provided."],
  ["Do you deliver to Amazon FBA warehouses?", "Amazon FBA delivery coordination is available when the assigned destination, shipment plan and carton or label scope are confirmed."],
  ["Can you ship to Hawaii, Alaska and Puerto Rico?", "These destinations can be reviewed. The final route, island or remote-area handoff and delivery requirements must be confirmed in the quote."],
  ["What information is required for a shipping quote?", "Send the product, package count, dimensions, total weight, pickup city, U.S. ZIP code, cargo-ready date and any FBA, residential or oversized requirements."]
];

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://gdlogi.us/#organization",
      name: "Good Logistics Co., Ltd.",
      url: "https://gdlogi.us/",
      logo: "https://gdlogi.us/good-shipping-homepage/assets/good-logistics-logo.png"
    },
    {
      "@type": "WebSite",
      "@id": "https://gdlogi.us/#website",
      url: "https://gdlogi.us/",
      name: "Good Logistics",
      publisher: { "@id": "https://gdlogi.us/#organization" },
      inLanguage: "en-US"
    },
    {
      "@type": "Service",
      "@id": "https://gdlogi.us/#china-usa-freight-service",
      name: "Freight Forwarding from China to the USA",
      serviceType: "Freight forwarding",
      provider: { "@id": "https://gdlogi.us/#organization" },
      areaServed: { "@type": "Country", name: "United States" },
      description: "Supplier pickup, consolidation, sea or air freight, customs coordination and final delivery planning from China to the United States."
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
      <link
        rel="preload"
        href="/good-shipping-homepage/assets/crane-truck-warehouse-1400.avif"
        as="image"
        type="image/avif"
        imageSrcSet="/good-shipping-homepage/assets/crane-truck-warehouse-800.avif 800w, /good-shipping-homepage/assets/crane-truck-warehouse-1400.avif 1400w"
        imageSizes="(max-width: 1100px) calc(100vw - 40px), 46vw"
        fetchPriority="high"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
      <HomeInteractions />
    </>
  );
}
