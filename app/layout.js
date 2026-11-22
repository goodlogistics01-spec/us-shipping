import "./globals.css";
import AnalyticsBridge from "./components/AnalyticsBridge";

export const metadata = {
  title: {
    default: "Freight Forwarding from China | GOOD LOGISTICS",
    template: "%s | GOOD LOGISTICS"
  },
  description:
    "China-side pickup, consolidation, cargo preparation and receiving checks coordinated with ocean, air or express freight and international delivery.",
  metadataBase: new URL("https://gdlogi.us"),
  applicationName: "GOOD LOGISTICS",
  icons: { icon: "/good-shipping-homepage/assets/good-logistics-logo.png" },
  formatDetection: { email: false, address: false, telephone: false }
};

export default function RootLayout({ children }) {
  const configuredGtmId = process.env.GTM_CONTAINER_ID || "";
  const gtmId = /^GTM-[A-Z0-9]+$/.test(configuredGtmId) ? configuredGtmId : "";

  return (
    <html lang="en">
      <body>
        {children}
        <AnalyticsBridge gtmId={gtmId} />
      </body>
    </html>
  );
}
