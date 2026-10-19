import "./globals.css";

export const metadata = {
  title: {
    default: "China to USA Freight Forwarder | Good Logistics",
    template: "%s | Good Logistics"
  },
  description:
    "Freight forwarding from China to the USA by sea, air and DDP. Supplier pickup, consolidation, Amazon FBA, oversized cargo and final delivery across the United States.",
  metadataBase: new URL("https://gdlogi.us"),
  applicationName: "Good Logistics",
  icons: { icon: "/good-shipping-homepage/assets/good-logistics-logo.png" },
  formatDetection: { email: false, address: false, telephone: false }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
