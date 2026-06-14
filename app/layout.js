import "./globals.css";

export const metadata = {
  title: {
    default: "Good Logistics Co., Ltd. | China to USA Freight Forwarder",
    template: "%s | Good Logistics Co., Ltd."
  },
  description:
    "Good Logistics Co., Ltd. helps importers move cargo from China to the USA with pickup, consolidation, freight, customs coordination and final delivery.",
  metadataBase: new URL("https://gdlogi.us")
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
