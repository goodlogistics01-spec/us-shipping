import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("../node_modules/.pnpm/node_modules/sharp");

const projectRoot = path.resolve(import.meta.dirname, "..");
const mediaSourceRoot = path.resolve(
  process.env.GDLOGI_MEDIA_SOURCE_ROOT || path.join(projectRoot, "..")
);
const outputDir = path.join(
  projectRoot,
  "public/good-shipping-homepage/assets/operations"
);

const assets = [
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
  }
];

async function sanitizedCrop(asset) {
  const cropped = await sharp(asset.source)
    .rotate()
    .extract(asset.crop)
    .jpeg({ quality: 96, chromaSubsampling: "4:4:4" })
    .toBuffer();

  const overlays = await Promise.all(
    asset.blur.map(async (region) => {
      const inset = Math.max(4, Math.min(10, Math.floor(Math.min(region.width, region.height) / 6)));
      const mask = Buffer.from(
        `<svg width="${region.width}" height="${region.height}" xmlns="http://www.w3.org/2000/svg">
          <defs><filter id="feather"><feGaussianBlur stdDeviation="${Math.max(3, inset / 2)}"/></filter></defs>
          <rect x="${inset}" y="${inset}" width="${region.width - inset * 2}" height="${region.height - inset * 2}" rx="${inset}" fill="white" filter="url(#feather)"/>
        </svg>`
      );
      const blurred = await sharp(cropped)
        .extract(region)
        .blur(16)
        .ensureAlpha()
        .composite([{ input: mask, blend: "dest-in" }])
        .png()
        .toBuffer();

      return { input: blurred, left: region.left, top: region.top };
    })
  );

  return sharp(cropped)
    .composite(overlays)
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
