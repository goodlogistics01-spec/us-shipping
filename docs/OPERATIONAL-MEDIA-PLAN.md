# Operational media plan

Updated: 2026-11-13
Scope: current five-asset set approved by the owner for publication on `gdlogi.us`; supplemental media will be added later.

## Page-to-asset map

| Page / section | Asset set | Purpose | Content boundary |
| --- | --- | --- | --- |
| Homepage hero | `china-operations-*` | Replace the text-only route board with a neutral cargo-handling setting | Do not claim a location or owned facility; confirm the operating model per shipment |
| Homepage operations strip | `consolidation-staging-*`, `warehouse-crates-*`, `packing-preparation-*` | Show origin staging, temporary storage context and crate preparation without filling every service card with a photo | Do not infer supplier count, shipment route, customer or inspection result from the photos |
| Homepage oversized section | `loading-coordination-*` | Show a real packed-cargo loading setting next to oversized planning copy | Do not imply ownership of the truck, forklift or warehouse |
| Supplier Pickup & Consolidation | `consolidation-staging-*` | Service-page hero | Caption confirms that supplier and shipment facts are separate from the photo |
| Warehousing & Inventory Coordination | `warehouse-crates-*` | Service-page hero | No warehouse ownership, area, real-time inventory or API claim |
| Oversized Cargo | `loading-coordination-*` hero and `packing-preparation-*` supporting image | Connect packaging review with loading-plan inputs | Packaging review is not certification or product inspection |
| Sea Freight | `consolidation-staging-*` and `loading-coordination-*` in “Cargo Facts Before Route Promises” | Illustrate the cargo facts used for planning, not a specific origin or shipment | Photos do not prove a location, port, sailing, U.S. delivery or route outcome |

The UK arrival, crane-delivery and unloading photos are intentionally held. They may later support a clearly labelled UK/global operation example after project rights and location details are confirmed. They must not be used as evidence of U.S., Hawaii, Alaska or Puerto Rico delivery. `早到柜子.jpg` is also held because it contains faces, plates, container identifiers, location clues and prominent third-party branding.

## Usage and crop spec

| Asset set | Aspect / largest output | Safety treatment | Display behavior |
| --- | --- | --- | --- |
| `china-operations-*` | 1:1 / 1200 × 1200 | Crop to crate area; blur remaining readable barcode; strip metadata | Hero: eager load, high fetch priority, `object-fit: cover` |
| `consolidation-staging-*` | 4:3 / 1000 × 750 | Crop out person and overhead location sign; blur small labels and handwritten markings; strip metadata | Lazy below fold; reusable service hero loads eagerly on its page |
| `warehouse-crates-*` | 4:3 / 1150 × 862 | Crop out most signage; blur visible barcode and shipment marking; strip metadata | Lazy below fold; eager when used as service hero |
| `packing-preparation-*` | 16:9 / 1000 × 563 | Crop away customer/brand labels; strip metadata | Lazy below fold; do not enlarge beyond source-derived output |
| `loading-coordination-*` | 4:5 / 550 × 688 | Crop out operator face and forklift branding; blur remaining small label; strip metadata | Lazy below fold; eager when used as service hero |

## Responsive export list

- `china-operations`: 480, 800 and 1200 px AVIF/WebP plus 1200 px progressive JPEG fallback.
- `consolidation-staging`: 480, 800 and 1000 px AVIF/WebP plus 1000 px progressive JPEG fallback.
- `warehouse-crates`: 480, 800 and 1150 px AVIF/WebP plus 1150 px progressive JPEG fallback.
- `packing-preparation`: 480, 800 and 1000 px AVIF/WebP plus 1000 px progressive JPEG fallback.
- `loading-coordination`: 320, 480 and 550 px AVIF/WebP plus 550 px progressive JPEG fallback.

All rendered `<img>` elements have explicit width and height. Below-fold images use native lazy loading and asynchronous decoding. Derivatives can be regenerated with `node scripts/generate-operation-images.mjs` while the recorded source paths are available.

## Alt text

- Cargo handling: `Wooden export crates staged inside a cargo handling facility.`
- Consolidation staging: `Mixed crates and packaged cargo staged inside a consolidation facility.`
- Warehouse crates: `Wooden export crates stored inside a cargo handling area.`
- Packing preparation: `Large wooden shipping crates prepared for cargo handling.`
- Loading context: `A wrapped wooden crate positioned on a truck.`

## Rights and authenticity flags

- `OWNER_APPROVED`: on 2026-11-13, Zoe explicitly instructed that the current selected materials be published on `gdlogi.us` while supplemental media is prepared later.
- `NOT_VERIFIED`: photographer ownership, customer permission, named facility, project identity and route are not established by the files alone.
- Approved captions use neutral “coordinated” language and do not claim owned warehouses, vehicles, equipment, laboratories or overseas networks.
- Cropping and blur reduce privacy exposure; the owner publication instruction is limited to the current website use and does not establish rights for unrelated reuse.

## Minimum additional material to request

Priority photo sets:

1. Receiving checks: packing-list count, outer-carton condition, label check and visible-damage record as four distinct frames.
2. FBA prep: FNSKU application, outer-carton label placement, polybagging and completed cartons.
3. Repacking: before/after carton change, protective material and sealed final package.
4. Kitting and light assembly: separated components, work step and completed kit with approved insert/accessories.
5. Multi-supplier coordination: supplier/batch-separated arrivals and the final grouped release, with all labels anonymized.
6. Container loading: wide loading view, bracing/placement detail and closed-container handoff with seal/container identifiers hidden.
7. Air-freight handoff: air-ready packaging or terminal handoff material that Good Logistics is cleared to publish.
8. U.S. final delivery: commercial-address or oversized delivery photos with confirmed project rights; separate approved material for Hawaii, Alaska or Puerto Rico if those destinations are to carry visual proof.
9. Team operations: staff checking documents or coordinating cargo, with written appearance consent.

Priority video clips:

- 8–20 seconds: arrival registration and quantity check.
- 8–20 seconds: labeling, repacking or kitting from input to completed package.
- 8–20 seconds: container loading, forklift transfer or oversized unloading.

Shoot horizontal clips first (4K or 1080p, stable, no music), then optional vertical versions. Keep original files. Avoid customer names, phone numbers, order numbers, readable barcodes, faces without consent, plates, container/seal numbers and third-party logos. For every approved asset, record date, safe location description, photographer/owner, represented operation, Good Logistics responsibility and public-use permission.
