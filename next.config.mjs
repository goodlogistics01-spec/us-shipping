const legacyRedirects = [
  ["/good-shipping-homepage", "/"],
  ["/good-shipping-homepage/", "/"],
  ["/good-shipping-homepage/index.html", "/"],
  ["/good-shipping-homepage/resources/", "/resources/"],
  ["/good-shipping-homepage/resources/index.html", "/resources/"],
  ["/good-shipping-homepage/author/zoe-zhou/", "/about/zoe-zhou/"],
  ["/good-shipping-homepage/author/zoe-zhou/index.html", "/about/zoe-zhou/"],
  ["/good-shipping-inquiry-form.html", "/quote/"],
  ["/good-shipping-homepage/services/air-freight-china-to-usa.html", "/services/air-freight-china-to-usa/"],
  ["/good-shipping-homepage/services/sea-freight-china-to-usa.html", "/services/sea-freight-china-to-usa/"],
  ["/good-shipping-homepage/services/ddp-shipping-china-to-usa.html", "/services/ddp-shipping-china-to-usa/"],
  ["/good-shipping-homepage/services/amazon-fba-shipping-china.html", "/services/amazon-fba-shipping/"],
  ["/good-shipping-homepage/services/oversized-cargo-shipping.html", "/services/oversized-cargo-shipping/"],
  ["/good-shipping-homepage/services/express-shipping-china-usa.html", "/services/air-freight-china-to-usa/"],
  ["/good-shipping-homepage/destinations/hawaii-shipping-from-china.html", "/destinations/hawaii/"],
  ["/good-shipping-homepage/destinations/alaska-shipping-from-china.html", "/destinations/alaska/"],
  ["/good-shipping-homepage/destinations/puerto-rico-shipping-from-china.html", "/destinations/puerto-rico/"],
  ["/thank-you.html", "/thank-you/"],
  ["/good-shipping-homepage/sitemap.xml", "/sitemap.xml"],
  ["/good-shipping-homepage/robots.txt", "/robots.txt"]
];

const unpublishedDraftRedirects = [
  "/good-shipping-homepage/blog/oversized-cargo-shipping-from-china-to-usa.html",
  "/good-shipping-homepage/blog/ddp-shipping-from-china-to-usa-quote-risks.html",
  "/good-shipping-homepage/blog/multi-supplier-consolidation-china-shipping.html",
  "/good-shipping-homepage/blog/shipping-from-china-to-hawaii.html",
  "/good-shipping-homepage/blog/shipping-from-china-to-puerto-rico.html"
];

const nextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      ...legacyRedirects.map(([source, destination]) => ({
        source,
        destination,
        statusCode: 301
      })),
      ...unpublishedDraftRedirects.map((source) => ({
        source,
        destination: "/resources/",
        permanent: false
      }))
    ];
  }
};

export default nextConfig;
