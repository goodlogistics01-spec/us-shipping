export const company = {
  name: "Good Logistics Co., Ltd.",
  website: "https://gdlogi.us",
  email: "zoe@gdlogi.com",
  phoneDisplay: "+86 135 5686 1676",
  phoneHref: "+8613556861676",
  whatsappHref: "https://wa.me/8613556861676"
};

export function createPageMetadata({
  title,
  description,
  path,
  image = "/good-shipping-homepage/assets/crane-truck-warehouse.jpg"
}) {
  const url = new URL(path, `${company.website}/`).toString();

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: company.name,
      type: "website",
      images: [image]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export const services = {
  "air-freight-china-to-usa": {
    navTitle: "Air Freight",
    title: "Air Freight from China to the USA",
    description:
      "Air freight from China to the USA with supplier pickup, export coordination, customs handoff and final delivery planning.",
    summary:
      "A practical option for time-sensitive commercial cargo when the shipping plan needs to balance speed, handling requirements and delivery scope.",
    bestFor: [
      "Urgent replenishment and time-sensitive inventory",
      "Higher-value cargo that needs a shorter transport window",
      "Commercial samples, replacement parts and smaller shipments",
      "Airport-to-airport or door-delivery requirements"
    ],
    plan: [
      "Confirm commodity, dimensions, gross weight and cargo-ready date.",
      "Review pickup, export, flight and U.S. delivery requirements.",
      "Compare routing and chargeable-weight options before booking.",
      "Coordinate handoffs through arrival and final delivery."
    ],
    faq: [
      ["What information is needed for an air freight quote?", "Send the product name, package count, dimensions, gross weight, pickup city, U.S. destination ZIP code and cargo-ready date."],
      ["Can air freight include door delivery?", "Yes. Door delivery can be included when the destination, customs scope and delivery conditions are confirmed in the quotation."],
      ["Is air freight always faster than ocean freight?", "Air freight usually has a shorter international transport window, but the complete schedule also depends on pickup, space, customs and final delivery."]
    ]
  },
  "sea-freight-china-to-usa": {
    navTitle: "Sea Freight",
    title: "Sea Freight from China to the USA",
    description:
      "FCL and LCL sea freight from China to the USA with pickup, consolidation and final delivery coordination.",
    summary:
      "FCL and LCL planning for commercial cargo where shipment size, landed cost, handling and delivery requirements need to be compared before booking.",
    bestFor: [
      "Full-container commercial shipments",
      "LCL cargo that does not require a full container",
      "Furniture, machinery and regular inventory",
      "Shipments where cost control matters more than urgency"
    ],
    plan: [
      "Review cargo volume, weight, packaging and supplier locations.",
      "Compare FCL, LCL and consolidation options.",
      "Confirm export, port, customs and destination-delivery scope.",
      "Coordinate booking, loading handoff and final delivery."
    ],
    faq: [
      ["Should I choose FCL or LCL?", "The right option depends on volume, cargo characteristics, handling risk and the total delivered cost. Both should be compared for larger LCL shipments."],
      ["Can you collect from more than one supplier?", "Multi-supplier pickup and consolidation can be planned when supplier locations, cargo-ready dates and package details are available."],
      ["Can sea freight include final U.S. delivery?", "Yes. The quotation can include delivery to a business, warehouse, Amazon FBA location or project site when the address and delivery conditions are confirmed."]
    ]
  },
  "ddp-shipping-china-to-usa": {
    navTitle: "DDP Door-to-Door",
    title: "DDP Shipping from China to the USA",
    description:
      "Scope-defined DDP door-to-door shipping from China to the USA with pickup, freight, customs coordination and final delivery.",
    summary:
      "A door-to-door option for buyers who want one clearly documented quotation covering the agreed shipment stages from China pickup through U.S. delivery.",
    bestFor: [
      "Buyers comparing delivered-cost options",
      "Commercial cargo needing coordinated door delivery",
      "Multi-supplier shipments with one delivery destination",
      "Shipments where responsibilities must be clearly defined"
    ],
    plan: [
      "Confirm the commodity, invoice value and importer requirements.",
      "Define what the quotation includes and excludes.",
      "Review customs-sensitive or regulated cargo before booking.",
      "Coordinate pickup, transport, clearance handoff and delivery."
    ],
    faq: [
      ["What should a DDP quote include?", "The quote should identify pickup, export handling, international freight, customs-related scope, duties or taxes where applicable, delivery and possible exclusions."],
      ["Is every product suitable for DDP shipping?", "No. Product restrictions, customs requirements, value and importer responsibilities must be reviewed before confirming a DDP plan."],
      ["How should I compare DDP quotations?", "Compare the same cargo details and delivery scope, then check duties, inspection charges, residential or liftgate fees, storage and other exclusions."]
    ]
  },
  "amazon-fba-shipping": {
    navTitle: "Amazon FBA",
    title: "Amazon FBA Shipping from China",
    description:
      "China to Amazon FBA freight planning with supplier pickup, consolidation, carton coordination and appointment delivery support.",
    summary:
      "Freight coordination for sellers who need cargo collected in China and delivered to the correct Amazon receiving location under a defined shipment plan.",
    bestFor: [
      "Inventory moving from one or multiple Chinese suppliers",
      "Cartonized cargo needing consolidation before export",
      "Air or ocean freight to U.S. FBA locations",
      "Shipments that require delivery appointment coordination"
    ],
    plan: [
      "Confirm the shipment plan and Amazon destination information.",
      "Review carton count, dimensions, weight and labeling scope.",
      "Coordinate pickup, consolidation and international freight.",
      "Plan the final appointment or approved delivery method."
    ],
    faq: [
      ["Do you create Amazon product listings or labels?", "The logistics scope can include agreed carton or shipment-label coordination, but listing compliance and final label data remain the seller's responsibility."],
      ["Can goods from several suppliers be combined?", "Yes, when supplier-ready dates and package details allow a coordinated consolidation plan."],
      ["What information is required for a quote?", "Send pickup locations, carton count, dimensions, weight, commodity, cargo-ready date and the assigned FBA destination or delivery region."]
    ]
  },
  "oversized-cargo-shipping": {
    navTitle: "Oversized Cargo",
    title: "Oversized Cargo Shipping from China to the USA",
    description:
      "Oversized and complex cargo shipping from China to the USA with packing, loading and final delivery planning.",
    summary:
      "Shipment planning for large, heavy or difficult cargo where dimensions, lifting points, packaging, route access and delivery equipment must be reviewed together.",
    bestFor: [
      "Machinery and industrial equipment",
      "Large furniture and commercial fixtures",
      "Crated cargo requiring special handling",
      "Project cargo with site-access constraints"
    ],
    plan: [
      "Collect exact packed dimensions, weights and handling photos.",
      "Review packaging, lifting points and loading method.",
      "Check route, equipment and destination-access requirements.",
      "Confirm responsibilities before pickup and final delivery."
    ],
    faq: [
      ["What photos are useful for planning?", "Provide the cargo, packaging, lifting points, nameplate where relevant, pickup access and delivery-site access."],
      ["Can oversized cargo be delivered to a project site?", "It may be possible after the site address, access, unloading equipment and appointment requirements are reviewed."],
      ["Why are exact dimensions important?", "Packed dimensions and weight affect equipment choice, route feasibility, handling method and total delivered cost."]
    ]
  },
  "supplier-consolidation": {
    navTitle: "Supplier Consolidation",
    title: "Multi-Supplier Consolidation in China",
    description:
      "Collect and consolidate cargo from multiple suppliers in China before shipping to the USA.",
    summary:
      "A coordinated pickup and consolidation workflow for U.S. importers sourcing from several Chinese suppliers and aiming to ship under one clear plan.",
    bestFor: [
      "Importers buying from several factories",
      "Mixed products with different cargo-ready dates",
      "Buyers comparing combined FCL or LCL options",
      "Shipments needing package and document checks before export"
    ],
    plan: [
      "Create a supplier and cargo-readiness list.",
      "Confirm pickup cities, package details and documents.",
      "Receive and check cargo against the agreed handoff record.",
      "Consolidate and release the shipment under the selected plan."
    ],
    faq: [
      ["What supplier details should I provide?", "Provide supplier contacts, pickup addresses, cargo-ready dates, product names, package counts, dimensions, weights and invoice information."],
      ["Does consolidation always reduce cost?", "Not always. Pickup distance, storage time, handling and cargo compatibility should be included in the comparison."],
      ["Can incompatible cargo be combined?", "Some products should be separated because of safety, customs, handling or contamination risks. Cargo compatibility must be reviewed first."]
    ]
  }
};

export const destinations = {
  hawaii: {
    title: "Shipping from China to Hawaii",
    description:
      "Plan ocean or air freight from China to Hawaii with customs coordination and final delivery requirements reviewed before booking.",
    summary:
      "Freight planning for commercial cargo moving from Chinese suppliers to Honolulu or other Hawaiian destinations, with the final island and delivery conditions confirmed in the quote.",
    considerations: [
      "Destination island, ZIP code and final delivery access",
      "Ocean, air or combined routing based on current schedules",
      "Cargo dimensions, packaging and special handling needs",
      "Customs, delivery appointment and unloading scope"
    ]
  },
  alaska: {
    title: "Shipping from China to Alaska",
    description:
      "Plan freight from China to Alaska with routing, customs coordination and final delivery requirements reviewed before booking.",
    summary:
      "Shipping coordination for cargo destined for Anchorage and other Alaska locations where onward routing, weather exposure and site access may affect the plan.",
    considerations: [
      "Final destination and access beyond the main gateway",
      "Current ocean, air or combined routing options",
      "Packaging suitable for handling and weather exposure",
      "Delivery equipment, appointment and unloading needs"
    ]
  },
  "puerto-rico": {
    title: "Shipping from China to Puerto Rico",
    description:
      "Plan freight from China to Puerto Rico with routing, customs documentation and island delivery scope reviewed before booking.",
    summary:
      "Ocean or air freight planning for commercial cargo moving to San Juan and other Puerto Rico destinations, with documentation and final delivery requirements confirmed in advance.",
    considerations: [
      "Port or airport routing based on the cargo and current schedule",
      "Commodity, invoice and consignee documentation",
      "Final delivery address and island access requirements",
      "Oversized, residential or appointment delivery conditions"
    ]
  }
};

export const resourceArticles = [
  {
    title: "How to Ship Oversized Cargo from China to the USA",
    description: "A planning guide for dimensions, packaging, lifting, routing and final delivery.",
    href: "/good-shipping-homepage/blog/oversized-cargo-shipping-from-china-to-usa.html"
  },
  {
    title: "DDP Shipping from China to the USA: Quote Inclusions and Risks",
    description: "A checklist for comparing scope, exclusions and customs-sensitive responsibilities.",
    href: "/good-shipping-homepage/blog/ddp-shipping-from-china-to-usa-quote-risks.html"
  },
  {
    title: "How to Consolidate Products from Multiple Chinese Suppliers",
    description: "A practical workflow for supplier pickup, cargo checks and consolidation planning.",
    href: "/good-shipping-homepage/blog/multi-supplier-consolidation-china-shipping.html"
  },
  {
    title: "Shipping from China to Hawaii",
    description: "Route, cargo and final-delivery questions to confirm before booking.",
    href: "/good-shipping-homepage/blog/shipping-from-china-to-hawaii.html"
  },
  {
    title: "Shipping from China to Puerto Rico",
    description: "Planning notes for documentation, routing and island delivery.",
    href: "/good-shipping-homepage/blog/shipping-from-china-to-puerto-rico.html"
  }
];
