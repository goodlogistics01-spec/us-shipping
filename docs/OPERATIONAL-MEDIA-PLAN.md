# Operational media plan

Updated: 2026-11-13
Scope: nine active asset sets selected from owner-approved uploads for publication on `gdlogi.us`, plus one previous derivative retained for rollback; supplemental media will be added later.

## Page-to-asset map

| Page / section | Asset set | Purpose | Content boundary |
| --- | --- | --- | --- |
| Homepage hero | `carton-container-*` | Lead with visible cartoned cargo inside a shipping container instead of a wooden-crate-dominant image | The owner explicitly approved the visible customer brand; the crop excludes plate, truck identifiers, seal and container identifiers; do not infer customer endorsement, route or case result |
| Homepage operations strip | `consolidation-staging-*`, `carton-handling-*`, `container-handoff-*` | Balance mixed consolidation, paper-carton handling and container handoff | Do not infer supplier count, named customer, shipment route or delivery result |
| Homepage oversized section | `loading-coordination-*` | Show a real packed-cargo loading setting next to oversized planning copy | Do not imply ownership of the truck, forklift or warehouse |
| Homepage U.S. delivery section | `redacted-delivery-record-*` | Show that delivery records can accompany final-delivery coordination without exposing shipment or personal data | This is a neutral record example, not a named case, testimonial or proof that every shipment receives the same document |
| Supplier Pickup & Consolidation | `consolidation-staging-*` | Service-page hero | Caption confirms that supplier and shipment facts are separate from the photo |
| Warehousing & Inventory Coordination | `warehouse-crates-*` | Service-page hero | No warehouse ownership, area, real-time inventory or API claim |
| Oversized Cargo | `specialist-lifting-*` hero and `packing-preparation-*` supporting image | Connect specialist lifting context and packaging review with loading-plan inputs | The image does not prove owned equipment, location, route or a specific project; packaging review is not certification or product inspection |
| Sea Freight | `consolidation-staging-*` and `container-handoff-*` in “Cargo Facts Before Route Promises” | Illustrate origin staging and a container handoff without presenting either image as a named case | Photos do not prove a location, port, sailing, U.S. delivery, Chicago case link or route outcome |

The delivery-location photos are intentionally held. `oversized-delivery-1/2` visibly show `ROYAL LIVER BUILDING 360 TOUR` and Liverpool wording; `uk-unload.jpg` has UK-consistent rear-plate, road-marking and telephone evidence but no verified city. `uk-arrival.jpg` and `uk-crane-delivery.jpg` do not contain enough unique visible evidence to assert an exact location. None may be used as evidence of U.S., Hawaii, Alaska or Puerto Rico delivery. A tightly cropped derivative of `早到柜子.jpg` is active only as neutral carton-handling context; the face, uniform mark, plates, vehicles and container identity are outside the crop. The Chicago-named folder is owner-approved for selection, but its folder name is not treated as case evidence. The selected branded-carton crop is active by explicit owner approval and keeps the brand without implying customer endorsement. The original delivery record remains private and outside Git/public; only the fully opaque-redacted derivative is published.

## Usage and crop spec

| Asset set | Aspect / largest output | Safety treatment | Display behavior |
| --- | --- | --- | --- |
| `carton-container-*` | 4:3 / 1200 × 900 | Crop preserves the owner-approved customer brand and carton markings while excluding plate, truck identifiers, seal and container identifiers; metadata stripped | Homepage hero: eager load, high fetch priority, `object-fit: cover` |
| `carton-handling-*` | 4:3 / 1200 × 900 | Tight crop excludes face, uniform mark, plates, vehicles and container identity; metadata stripped | Homepage operations card: lazy load |
| `redacted-delivery-record-*` | 612:285 / 640 × 298 | Driver, vehicle/container, date, times, full address, ZIP and signature are covered with opaque blocks; source stays outside Git/public | Lazy below fold; small supporting evidence only |
| `china-operations-*` | 1:1 / 1200 × 1200 | Crop to crate area; blur remaining readable barcode; strip metadata | Retained for rollback; no current page reference |
| `consolidation-staging-*` | 4:3 / 1000 × 750 | Crop out person and overhead location sign; blur small labels and handwritten markings; strip metadata | Lazy below fold; reusable service hero loads eagerly on its page |
| `warehouse-crates-*` | 4:3 / 1150 × 862 | Crop out most signage; blur visible barcode and shipment marking; strip metadata | Lazy below fold; eager when used as service hero |
| `packing-preparation-*` | 16:9 / 1000 × 563 | Crop away customer/brand labels; strip metadata | Lazy below fold; do not enlarge beyond source-derived output |
| `loading-coordination-*` | 4:5 / 550 × 688 | Crop out operator face and forklift branding; blur remaining small label; strip metadata | Lazy below fold in the homepage oversized section |
| `container-handoff-*` | 4:5 / 1200 × 1500 | Crop out plate, trailer identifiers and most surroundings; blur container identity; strip metadata | Lazy below fold in the homepage operations strip and sea-freight evidence pair |
| `specialist-lifting-*` | 3:2 / 1200 × 800 | Crop out people, equipment-provider branding, vehicle identity and readable shipment details; strip metadata | Eager as the oversized-cargo service hero |

## Responsive export list

- `carton-container`: 480, 800 and 1200 px AVIF/WebP plus 1200 px progressive JPEG fallback.
- `carton-handling`: 480, 800 and 1200 px AVIF/WebP plus 1200 px progressive JPEG fallback.
- `redacted-delivery-record`: 480 and 640 px AVIF/WebP plus 640 px progressive JPEG fallback.
- `china-operations`: 480, 800 and 1200 px AVIF/WebP plus 1200 px progressive JPEG fallback.
- `consolidation-staging`: 480, 800 and 1000 px AVIF/WebP plus 1000 px progressive JPEG fallback.
- `warehouse-crates`: 480, 800 and 1150 px AVIF/WebP plus 1150 px progressive JPEG fallback.
- `packing-preparation`: 480, 800 and 1000 px AVIF/WebP plus 1000 px progressive JPEG fallback.
- `loading-coordination`: 320, 480 and 550 px AVIF/WebP plus 550 px progressive JPEG fallback.
- `container-handoff`: 480, 800 and 1200 px AVIF/WebP plus 1200 px progressive JPEG fallback.
- `specialist-lifting`: 480, 800 and 1200 px AVIF/WebP plus 1200 px progressive JPEG fallback.

All rendered `<img>` elements have explicit width and height. Below-fold images use native lazy loading and asynchronous decoding. Derivatives can be regenerated with `node scripts/generate-operation-images.mjs` while the recorded source paths are available.

## Alt text

- Cartoned cargo: `Branded cartons and palletized cargo arranged inside a shipping container.`
- Carton handling: `A sealed carton being moved during a cargo handoff.`
- Delivery record: `A proof-of-delivery record with personal and shipment details redacted.`
- Cargo handling: `Wooden export crates staged inside a cargo handling facility.`
- Consolidation staging: `Mixed crates and packaged cargo staged inside a consolidation facility.`
- Warehouse crates: `Wooden export crates stored inside a cargo handling area.`
- Packing preparation: `Large wooden shipping crates prepared for cargo handling.`
- Loading context: `A wrapped wooden crate positioned on a truck.`
- Container handoff: `Closed shipping container doors at a cargo handoff.`
- Specialist lifting: `Truck-mounted lifting equipment positioned for cargo handling at an indoor handoff.`

## Rights and authenticity flags

- `OWNER_APPROVED`: on 2026-11-13, Zoe explicitly confirmed that all materials uploaded to this project may be considered for public website use and instructed that suitable existing materials be published while supplemental media is prepared later.
- `NOT_VERIFIED`: photographer ownership, customer permission, named facility, project identity and route are not established by the files alone.
- Approved captions use neutral “coordinated” language and do not claim owned warehouses, vehicles, equipment, laboratories or overseas networks.
- Cropping and blur reduce privacy exposure; the owner publication instruction is limited to the current website use and does not establish rights for unrelated reuse.
- Owner approval does not override suitability: private chats, unredacted legal records, conflicting branded cards, duplicate crops, geographically misleading delivery photos and customer-identifiable close-ups remain inactive.
- The redacted delivery record is generated only when the private source path is supplied through `GDLOGI_DELIVERY_RECORD_SOURCE`; the source image is never copied into the repository or public asset directory.

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
