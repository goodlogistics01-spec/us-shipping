import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-static";

export const metadata = {
  title: "Good Logistics Co., Ltd. | China to USA Freight Forwarder",
  description:
    "China to USA door-to-door freight forwarding, DDP shipping, oversized cargo, Amazon FBA logistics, customs coordination and final delivery.",
  alternates: {
    canonical: "https://gdlogi.us/"
  },
  openGraph: {
    title: "Good Logistics Co., Ltd. | China to USA Freight Forwarder",
    description:
      "Control cost, risk and delivery from China pickup to final delivery in the United States.",
    url: "https://gdlogi.us/",
    siteName: "Good Logistics Co., Ltd.",
    type: "website"
  }
};

function extractTagContent(html, tagName) {
  const match = html.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? match[1] : "";
}

export default function Home() {
  const htmlPath = path.join(process.cwd(), "content", "good-shipping-homepage-preview.html");
  const html = fs.readFileSync(htmlPath, "utf8");
  const styles = extractTagContent(html, "style");
  const body = extractTagContent(html, "body");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
