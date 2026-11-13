import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("../node_modules/.pnpm/node_modules/sharp");

const projectRoot = path.resolve(import.meta.dirname, "..");
const mediaSourceRoot = path.resolve(
  process.env.GDLOGI_MEDIA_SOURCE_ROOT || path.join(projectRoot, "..")
);
const desktopMediaSourceRoot = path.resolve(
  process.env.GDLOGI_DESKTOP_MEDIA_SOURCE_ROOT || path.join(projectRoot, "../../..", "Desktop")
);
const outputDir = path.join(
  projectRoot,
  "public/good-shipping-homepage/assets/operations"
);
const deliveryRecordSource = process.env.GDLOGI_DELIVERY_RECORD_SOURCE;

const assets = [
  {
    name: "carton-handling",
    source: path.join(desktopMediaSourceRoot, "早到柜子.jpg"),
    crop: { left: 2050, top: 1850, width: 1600, height: 1200 },
    blur: [],
    widths: [480, 800, 1200]
  },
  {
    name: "carton-container",
    source: path.join(desktopMediaSourceRoot, "芝加哥整柜直送/柜门封尾.jpg"),
    crop: { left: 0, top: 900, width: 3072, height: 2304 },
    workingWidth: 1200,
    blur: [
      { left: 148, top: 270, width: 152, height: 110, sigma: 24 },
      { left: 316, top: 270, width: 164, height: 110, sigma: 24 },
      { left: 234, top: 367, width: 195, height: 160, sigma: 24 },
      { left: 430, top: 375, width: 160, height: 145, sigma: 24 },
      { left: 133, top: 531, width: 168, height: 141, sigma: 24 },
      { left: 309, top: 527, width: 168, height: 145, sigma: 24 },
      { left: 230, top: 656, width: 172, height: 180, sigma: 24 },
      { left: 418, top: 652, width: 176, height: 180, sigma: 24 },
      { left: 859, top: 141, width: 152, height: 105, sigma: 24 },
      { left: 695, top: 219, width: 137, height: 117, sigma: 24 },
      { left: 855, top: 293, width: 164, height: 129, sigma: 24 },
      { left: 691, top: 371, width: 145, height: 129, sigma: 24 },
      { left: 695, top: 496, width: 152, height: 152, sigma: 24 },
      { left: 875, top: 508, width: 168, height: 160, sigma: 24 }
    ],
    blurFeather: { inset: 8, deviation: 4 },
    widths: [480, 800, 1200]
  },
  ...(deliveryRecordSource
    ? [{
        name: "redacted-delivery-record",
        source: path.resolve(deliveryRecordSource),
        crop: { left: 20, top: 0, width: 612, height: 285 },
        blur: [],
        redact: [
          { left: 60, top: 5, width: 125, height: 45 },
          { left: 190, top: 5, width: 135, height: 45 },
          { left: 505, top: 5, width: 107, height: 65 },
          { left: 60, top: 38, width: 270, height: 48 },
          { left: 70, top: 135, width: 110, height: 54 },
          { left: 205, top: 138, width: 120, height: 54 },
          { left: 335, top: 123, width: 215, height: 63 },
          { left: 330, top: 165, width: 282, height: 62 },
          { left: 225, top: 198, width: 260, height: 82 }
        ],
        widths: [480, 640]
      }]
    : []),
  {
    name: "china-operations",
    source: path.join(mediaSourceRoot, "谷得全球官网/public/images/china-warehouse.jpg"),
    crop: { left: 2100, top: 1250, width: 1800, height: 1800 },
    blur: [
      { left: 1300, top: 780, width: 220, height: 150 }
    ],
    widths: [480, 800, 1200]
  },
  {
    name: "consolidation-staging",
    source: path.join(mediaSourceRoot, "谷得全球官网/public/images/consolidation.jpg"),
    crop: { left: 500, top: 750, width: 2500, height: 1875 },
    blur: [
      { left: 1650, top: 300, width: 350, height: 180 },
      { left: 850, top: 1050, width: 500, height: 180 },
      { left: 1300, top: 1050, width: 260, height: 220 },
      { left: 1050, top: 1450, width: 300, height: 220 }
    ],
    widths: [480, 800, 1000]
  },
  {
    name: "packing-preparation",
    source: path.join(mediaSourceRoot, "谷得官网新/public/images/packing-detail.jpg"),
    crop: { left: 0, top: 350, width: 1000, height: 563 },
    blur: [],
    widths: [480, 800, 1000]
  },
  {
    name: "warehouse-crates",
    source: path.join(mediaSourceRoot, "谷得官网新/public/images/warehouse-crates.jpg"),
    crop: { left: 350, top: 100, width: 1150, height: 862 },
    blur: [
      { left: 410, top: 415, width: 115, height: 85 }
    ],
    widths: [480, 800, 1150]
  },
  {
    name: "loading-coordination",
    source: path.join(mediaSourceRoot, "谷得官网新/public/images/crane-loading.jpg"),
    crop: { left: 0, top: 320, width: 550, height: 688 },
    blur: [
      { left: 0, top: 0, width: 75, height: 105 }
    ],
    widths: [320, 480, 550]
  },
  {
    name: "container-handoff",
    source: path.join(desktopMediaSourceRoot, "芝加哥整柜直送/完柜.jpg"),
    crop: { left: 700, top: 200, width: 2000, height: 2500 },
    blur: [
      { left: 880, top: 380, width: 1120, height: 520 }
    ],
    widths: [480, 800, 1200]
  },
  {
    name: "recipient-handoff",
    source: path.join(
      projectRoot,
      "public/good-shipping-homepage/assets/oversized-delivery-1.jpg"
    ),
    crop: { left: 0, top: 640, width: 1536, height: 1152 },
    blur: [
      { left: 870, top: 220, width: 125, height: 125, sigma: 26 }
    ],
    blurFeather: { inset: 3, deviation: 2 },
    widths: [480, 800, 1200]
  },
  {
    name: "specialist-lifting",
    source: path.join(
      projectRoot,
      "public/good-shipping-homepage/assets/crane-truck-loading.jpg"
    ),
    crop: { left: 0, top: 300, width: 1250, height: 833 },
    blur: [],
    widths: [480, 800, 1200]
  }
];

async function sanitizedCrop(asset) {
  let cropPipeline = sharp(asset.source)
    .rotate()
    .extract(asset.crop);

  if (asset.workingWidth) {
    const workingHeight = Math.round(
      asset.workingWidth / (asset.crop.width / asset.crop.height)
    );
    cropPipeline = cropPipeline.resize(asset.workingWidth, workingHeight, {
      fit: "fill"
    });
  }

  const cropped = await cropPipeline
    .jpeg({ quality: 96, chromaSubsampling: "4:4:4" })
    .toBuffer();

  const overlays = await Promise.all(
    asset.blur.map(async (region) => {
      const inset = asset.blurFeather?.inset
        ?? Math.max(4, Math.min(10, Math.floor(Math.min(region.width, region.height) / 6)));
      const deviation = asset.blurFeather?.deviation ?? Math.max(3, inset / 2);
      const mask = Buffer.from(
        `<svg width="${region.width}" height="${region.height}" xmlns="http://www.w3.org/2000/svg">
          <defs><filter id="feather"><feGaussianBlur stdDeviation="${deviation}"/></filter></defs>
          <rect x="${inset}" y="${inset}" width="${region.width - inset * 2}" height="${region.height - inset * 2}" rx="${inset}" fill="white" filter="url(#feather)"/>
        </svg>`
      );
      const blurred = await sharp(cropped)
        .extract(region)
        .blur(region.sigma || 16)
        .ensureAlpha()
        .composite([{ input: mask, blend: "dest-in" }])
        .png()
        .toBuffer();

      return { input: blurred, left: region.left, top: region.top };
    })
  );
  const redactions = (asset.redact || []).map((region) => ({
    input: {
      create: {
        width: region.width,
        height: region.height,
        channels: 4,
        background: region.color || "#cfd5dc"
      }
    },
    left: region.left,
    top: region.top
  }));

  return sharp(cropped)
    .composite([...overlays, ...redactions])
    .jpeg({ quality: 96, chromaSubsampling: "4:4:4" })
    .toBuffer();
}

async function exportAsset(asset) {
  const sanitized = await sanitizedCrop(asset);
  const aspectRatio = asset.crop.width / asset.crop.height;

  for (const width of asset.widths) {
    const height = Math.round(width / aspectRatio);
    const resized = sharp(sanitized).resize(width, height, { fit: "fill" });

    await Promise.all([
      resized.clone().avif({ quality: 56, effort: 6 }).toFile(
        path.join(outputDir, `${asset.name}-${width}.avif`)
      ),
      resized.clone().webp({ quality: 78, effort: 6 }).toFile(
        path.join(outputDir, `${asset.name}-${width}.webp`)
      )
    ]);
  }

  const largestWidth = Math.max(...asset.widths);
  const largestHeight = Math.round(largestWidth / aspectRatio);
  await sharp(sanitized)
    .resize(largestWidth, largestHeight, { fit: "fill" })
    .jpeg({ quality: 82, progressive: true, chromaSubsampling: "4:2:0" })
    .toFile(path.join(outputDir, `${asset.name}-${largestWidth}.jpg`));
}

await fs.mkdir(outputDir, { recursive: true });
for (const asset of assets) {
  await exportAsset(asset);
}

console.log(`Generated ${assets.length} sanitized responsive image sets in ${outputDir}`);
