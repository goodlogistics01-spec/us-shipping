# Visual Asset Register — Hero correction — 2026-11-22

This register records the source, licence, public-use boundary, crop basis and generated files for the two stock photographs used in the homepage and Sea Freight heroes. They are industry context, not evidence of assets owned or operated by GOOD LOGISTICS.

## Homepage: international freight context

| Field | Record |
| --- | --- |
| Source page | [Busy shipping port with cranes and cargo containers](https://unsplash.com/photos/busy-shipping-port-with-cranes-and-cargo-containers-A0IOJ34brD0) |
| Photographer | Daniel Miksha |
| Source library | Unsplash |
| Licence reviewed | [Unsplash License](https://unsplash.com/license) |
| Downloaded source resolution | 4000 × 2250 px |
| Website role | Homepage industry context for an international container terminal and cargo movement |
| HTML alternative text | `Aerial view of a container ship, cargo cranes and stacked containers at a port terminal.` |
| Selection basis | Ship, quay cranes, containers and terminal lanes are all visible; the frame contains no empty sky and only limited water. |

## Sea Freight page: FCL/LCL port context

| Field | Record |
| --- | --- |
| Source page | [Container Ships Docked at a Busy Industrial Port](https://www.pexels.com/photo/container-ships-docked-at-a-busy-industrial-port-38710444/) |
| Photographer | David Burns |
| Source library | Pexels |
| Licence reviewed | [Pexels License](https://www.pexels.com/license/) |
| Source resolution shown by Pexels | 3936 × 2624 px |
| Website role | Sea Freight industry context showing berthed container vessels, cargo cranes and a tug |
| HTML alternative text | `Container ships berthed beside cargo-handling cranes at an industrial port.` |
| Selection basis | The vessels, cranes and port activity are clear subjects and differ visibly from the homepage aerial overview. |

## Crop and compression basis

All derivatives were generated locally with Sharp. No generative editing, object replacement, logo removal or claim-bearing text was added. Source metadata was not retained.

- Desktop: attention-guided 4:3 crop, exported at 960 × 720, 1600 × 1200 and 2400 × 1800.
- Mobile: separate attention-guided 10:7 crop, exported at 640 × 448 and 960 × 672 so the ship and handling equipment remain visible in the shorter mobile card.
- Formats: AVIF first, WebP second and responsive JPEG fallback.
- Loading: both hero images have intrinsic dimensions, responsive `sizes`, high fetch priority and async decoding.
- Display: each image is presented as a white-page image card. No caption or adjacent claim identifies the photographed port, ship, carrier or cargo as a GOOD LOGISTICS asset or shipment.

## Public-use boundary

The photographs may illustrate the international freight and sea-freight environment. They must not be presented as:

- a vessel, container, cargo, terminal, crane, facility or equipment owned or operated by GOOD LOGISTICS;
- a GOOD LOGISTICS shipment, customer, route, delivery or case study;
- proof of a carrier relationship, sailing, transit time, port service or geographic coverage;
- evidence of fleet ownership, cargo volume, company scale or service performance.

Visible third-party vessel and container markings are incidental parts of licensed stock photography and do not indicate a commercial relationship.

## Generated derivatives

All files are stored in `public/good-shipping-homepage/assets/brand/`.

| Asset family | Dimensions | AVIF | WebP | JPEG |
| --- | ---: | ---: | ---: | ---: |
| `container-ship-hero-desktop-960` | 960 × 720 | 78,170 B | 163,846 B | 177,356 B |
| `container-ship-hero-desktop-1600` | 1600 × 1200 | 212,306 B | 477,006 B | 493,412 B |
| `container-ship-hero-desktop-2400` | 2400 × 1800 | 440,035 B | 1,052,666 B | 1,055,021 B |
| `container-ship-hero-mobile-640` | 640 × 448 | 35,290 B | 73,834 B | 78,125 B |
| `container-ship-hero-mobile-960` | 960 × 672 | 75,548 B | 158,626 B | 170,516 B |
| `sea-freight-terminal-hero-desktop-960` | 960 × 720 | 48,803 B | 101,902 B | 121,493 B |
| `sea-freight-terminal-hero-desktop-1600` | 1600 × 1200 | 123,129 B | 258,790 B | 313,517 B |
| `sea-freight-terminal-hero-desktop-2400` | 2400 × 1800 | 243,849 B | 502,904 B | 639,464 B |
| `sea-freight-terminal-hero-mobile-640` | 640 × 448 | 22,031 B | 44,414 B | 53,398 B |
| `sea-freight-terminal-hero-mobile-960` | 960 × 672 | 45,295 B | 93,078 B | 112,649 B |

The final crops were checked on the built HTTP preview at 1440 × 1000 and 390 × 844. In both image families the ship and cargo-handling equipment remain visible, the selected mobile source is used, CTA controls remain inside the viewport and the document has no horizontal overflow. Evidence is stored in `artifacts/hero-visual-correction-2026-11-22/`. Any future replacement requires a new source, licence and usage-boundary entry before publication.
