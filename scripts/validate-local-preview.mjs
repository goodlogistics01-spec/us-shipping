import nextConfig from "../next.config.mjs";

const previewOrigin = new URL(
  process.env.LOCAL_PREVIEW_ORIGIN || process.argv[2] || "http://127.0.0.1:3100"
);
const loopbackHosts = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);

if (!loopbackHosts.has(previewOrigin.hostname)) {
  throw new Error(`Refusing to test a non-loopback origin: ${previewOrigin.origin}`);
}

const productionOrigin = "https://gdlogi.us";
const failures = [];
const pageCache = new Map();

function check(condition, message) {
  if (!condition) failures.push(message);
}

function decodeHtml(value = "") {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)));
}

function getAttribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = tag.match(
    new RegExp(`\\b${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i")
  );
  return decodeHtml(match?.[1] ?? match?.[2] ?? match?.[3] ?? "");
}

function findTag(html, tagName, predicate = () => true) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) || [];
  return tags.find(predicate) || "";
}

function textContent(html = "") {
  return decodeHtml(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function pageMetadata(html) {
  const title = textContent(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const h1 = textContent(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
  const descriptionTag = findTag(
    html,
    "meta",
    (tag) => getAttribute(tag, "name").toLowerCase() === "description"
  );
  const canonicalTag = findTag(
    html,
    "link",
    (tag) => getAttribute(tag, "rel").toLowerCase().split(/\s+/).includes("canonical")
  );
  const robotsTag = findTag(
    html,
    "meta",
    (tag) => getAttribute(tag, "name").toLowerCase() === "robots"
  );

  return {
    title,
    h1,
    description: getAttribute(descriptionTag, "content"),
    canonical: getAttribute(canonicalTag, "href"),
    robots: getAttribute(robotsTag, "content")
  };
}

async function fetchPreview(pathname, { redirect = "manual" } = {}) {
  const url = new URL(pathname, previewOrigin);
  return fetch(url, {
    redirect,
    headers: { "user-agent": "GOOD-LOGISTICS-LOCAL-ACCEPTANCE/1.0" }
  });
}

async function getPage(pathname) {
  const key = new URL(pathname, previewOrigin).toString();
  if (!pageCache.has(key)) {
    pageCache.set(key, (async () => {
      const response = await fetch(key, {
        redirect: "manual",
        headers: { "user-agent": "GOOD-LOGISTICS-LOCAL-ACCEPTANCE/1.0" }
      });
      return { response, html: await response.text() };
    })());
  }
  return pageCache.get(key);
}

async function followRedirectChain(source, maximumHops = 4) {
  const chain = [];
  let current = new URL(source, previewOrigin);

  for (let hop = 0; hop < maximumHops; hop += 1) {
    const response = await fetch(current, { redirect: "manual" });
    chain.push({ status: response.status, pathname: current.pathname, location: response.headers.get("location") });

    if (response.status < 300 || response.status >= 400) {
      return { chain, finalUrl: current, finalStatus: response.status };
    }

    const location = response.headers.get("location");
    if (!location) return { chain, finalUrl: current, finalStatus: response.status };
    current = new URL(location, current);
  }

  return { chain, finalUrl: current, finalStatus: 0 };
}

const robotsResponse = await fetchPreview("/robots.txt");
const robotsText = await robotsResponse.text();
check(robotsResponse.status === 200, `robots.txt returned ${robotsResponse.status}`);
check(/^User-agent:\s*\*/im.test(robotsText), "robots.txt is missing the global user agent rule");
check(/^Allow:\s*\//im.test(robotsText), "robots.txt is missing Allow: /");
check(/^Sitemap:\s*https:\/\/gdlogi\.us\/sitemap\.xml/im.test(robotsText), "robots.txt has the wrong sitemap URL");

const sitemapResponse = await fetchPreview("/sitemap.xml");
const sitemapText = await sitemapResponse.text();
check(sitemapResponse.status === 200, `sitemap.xml returned ${sitemapResponse.status}`);
const sitemapUrls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => decodeHtml(match[1]));
const uniqueSitemapUrls = new Set(sitemapUrls);
check(sitemapUrls.length > 0, "sitemap.xml contains no URLs");
check(uniqueSitemapUrls.size === sitemapUrls.length, "sitemap.xml contains duplicate URLs");
check(!sitemapUrls.some((url) => new URL(url).pathname.startsWith("/thank-you")), "thank-you page must not be in sitemap.xml");

const renderedPages = new Map();
let imageCount = 0;
let internalLinkCount = 0;
let modernImageSourceCount = 0;
const imageTargets = new Set();

for (const canonicalUrl of sitemapUrls) {
  const productionUrl = new URL(canonicalUrl);
  check(productionUrl.origin === productionOrigin, `sitemap URL uses an unexpected origin: ${canonicalUrl}`);
  const { response, html } = await getPage(`${productionUrl.pathname}${productionUrl.search}`);
  const metadata = pageMetadata(html);
  renderedPages.set(canonicalUrl, html);

  check(response.status === 200, `${productionUrl.pathname} returned ${response.status}`);
  check(Boolean(metadata.title), `${productionUrl.pathname} is missing a title`);
  check(Boolean(metadata.description), `${productionUrl.pathname} is missing a meta description`);
  check(Boolean(metadata.h1), `${productionUrl.pathname} is missing an H1`);
  check(metadata.canonical === canonicalUrl, `${productionUrl.pathname} canonical is ${metadata.canonical || "missing"}`);
  check(/GOOD LOGISTICS/i.test(html), `${productionUrl.pathname} is missing the public brand`);
  check(!/\bGOOD SHIPPING\b/i.test(html), `${productionUrl.pathname} exposes the retired public brand`);
  check(/zoe@gdlogi\.com/i.test(html), `${productionUrl.pathname} is missing the public email`);
  check(/\+86\s*135\s*5686\s*1676/.test(textContent(html)), `${productionUrl.pathname} is missing the public phone/WhatsApp number`);
  check(!/#case-study\b/i.test(html), `${productionUrl.pathname} still links to the unpublished case study`);
  check(!/"@type"\s*:\s*"CaseStudy"/i.test(html), `${productionUrl.pathname} exposes case-study structured data`);

  for (const imageTag of html.match(/<img\b[^>]*>/gi) || []) {
    imageCount += 1;
    check(getAttribute(imageTag, "alt") !== "", `${productionUrl.pathname} has an image without meaningful alt text`);
    check(Boolean(getAttribute(imageTag, "width")), `${productionUrl.pathname} has an image without width`);
    check(Boolean(getAttribute(imageTag, "height")), `${productionUrl.pathname} has an image without height`);
    const src = getAttribute(imageTag, "src");
    if (src) imageTargets.add(new URL(src, canonicalUrl).pathname);
  }

  for (const sourceTag of html.match(/<source\b[^>]*>/gi) || []) {
    if (getAttribute(sourceTag, "type").toLowerCase() !== "image/avif") continue;
    modernImageSourceCount += 1;
    const firstSource = getAttribute(sourceTag, "srcset").split(",")[0]?.trim().split(/\s+/)[0];
    if (firstSource) imageTargets.add(new URL(firstSource, canonicalUrl).pathname);
  }
}

for (const imagePath of imageTargets) {
  const response = await fetchPreview(imagePath);
  check(response.status === 200, `image ${imagePath} returned ${response.status}`);
  check(/^image\//i.test(response.headers.get("content-type") || ""), `image ${imagePath} has the wrong content type`);
}
check(modernImageSourceCount > 0, "no AVIF image source is present on a sitemap page");

const linkChecks = new Map();
for (const [canonicalUrl, html] of renderedPages) {
  for (const anchorTag of html.match(/<a\b[^>]*>/gi) || []) {
    const href = getAttribute(anchorTag, "href");
    if (!href || /^(?:mailto:|tel:|javascript:)/i.test(href)) continue;

    const target = new URL(href, canonicalUrl);
    if (target.origin !== productionOrigin) continue;
    internalLinkCount += 1;

    const targetKey = `${target.pathname}${target.search}`;
    if (!linkChecks.has(targetKey)) {
      linkChecks.set(targetKey, (async () => {
        const { response, html: targetHtml } = await getPage(targetKey);
        return { response, html: targetHtml };
      })());
    }

    const { response, html: targetHtml } = await linkChecks.get(targetKey);
    check(response.status === 200, `${canonicalUrl} links to ${href}, which returned ${response.status}`);

    if (target.hash) {
      const fragment = decodeURIComponent(target.hash.slice(1));
      const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      check(
        new RegExp(`\\b(?:id|name)=["']${escaped}["']`, "i").test(targetHtml),
        `${canonicalUrl} links to missing fragment ${target.hash} on ${target.pathname}`
      );
    }
  }
}

const redirects = await nextConfig.redirects();
for (const rule of redirects) {
  const result = await followRedirectChain(rule.source);
  const expectedDestination = new URL(rule.destination, previewOrigin);
  check(
    result.finalStatus === 200,
    `${rule.source} ended with ${result.finalStatus}; chain: ${result.chain.map((step) => step.status).join(" -> ")}`
  );
  check(
    result.finalUrl.pathname === expectedDestination.pathname,
    `${rule.source} ended at ${result.finalUrl.pathname}, expected ${expectedDestination.pathname}`
  );

  const expectedRedirectStatus = rule.statusCode || (rule.permanent ? 308 : 307);
  check(
    result.chain.some((step) => step.status === expectedRedirectStatus),
    `${rule.source} did not include configured status ${expectedRedirectStatus}; chain: ${result.chain.map((step) => step.status).join(" -> ")}`
  );
}

const thankYou = await getPage("/thank-you/?request_id=GL-20261110-00000000");
const thankYouMetadata = pageMetadata(thankYou.html);
check(thankYou.response.status === 200, `unconfirmed thank-you page returned ${thankYou.response.status}`);
check(/noindex/i.test(thankYouMetadata.robots), "thank-you page is missing noindex");
check(/No confirmed inquiry found/i.test(thankYou.html), "thank-you page accepts an unmatched request without its confirmation cookie");

if (failures.length > 0) {
  console.error(`Local preview acceptance FAILED with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Local preview acceptance PASS");
  console.log(`Origin: ${previewOrigin.origin}`);
  console.log(`Sitemap pages: ${sitemapUrls.length}`);
  console.log(`Internal links checked: ${internalLinkCount} (${linkChecks.size} unique targets)`);
  console.log(`Legacy redirects checked: ${redirects.length}`);
  console.log(`Rendered images checked: ${imageCount}`);
  console.log(`Image assets checked: ${imageTargets.size}; AVIF sources rendered: ${modernImageSourceCount}`);
  console.log("SEO: title, description, H1 and canonical present on every sitemap page");
  console.log("Brand/contact: GOOD LOGISTICS, public email and phone are consistent on every sitemap page");
  console.log("Indexing: robots/sitemap valid; thank-you remains noindex and cookie-bound");
}
