export const company = {
  name: "GOOD LOGISTICS",
  legalName: "Good Logistics Co., Ltd.",
  chineseName: "深圳市谷得供应链有限公司",
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
  image = "/good-shipping-homepage/assets/good-logistics-logo.png"
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
    category: "International Freight & Delivery",
    eyebrow: "China-to-USA air freight",
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
    operations: [
      "Coordinate pickup from the confirmed supplier location in China.",
      "Review packed dimensions, gross weight and chargeable-weight factors.",
      "Arrange the agreed export and international air-freight scope.",
      "Coordinate customs handoff and final delivery to the confirmed U.S. address."
    ],
    boundaries: [
      "Flight space, routing and schedules are confirmed for the shipment; they are not fixed website promises.",
      "Restricted, dangerous or regulated goods require separate review before acceptance.",
      "Customs decisions and third-party carrier performance remain outside an unconditional guarantee."
    ],
    customerInputs: [
      "Product name, packaging and any handling restrictions",
      "Supplier address, cargo-ready date and pickup contact",
      "Package count, packed dimensions and gross weight",
      "U.S. destination and access or appointment requirements"
    ],
    costFactors: [
      "Chargeable weight and package dimensions",
      "Origin pickup and airport routing",
      "Commodity and handling requirements",
      "Customs scope and final-delivery conditions"
    ],
    startSteps: [
      "Share the cargo, supplier and destination details.",
      "Confirm the handling, customs and delivery scope to quote.",
      "Review the route and included charges before booking.",
      "Coordinate the agreed handoffs and progress updates."
    ],
    quoteNeeds: ["shipping"],
    shippingMethod: "air-freight",
    relatedServices: [
      ["Sea Freight", "/services/sea-freight-china-to-usa/"],
      ["Supplier Pickup & Consolidation", "/services/supplier-consolidation/"],
      ["DDP Door-to-Door", "/services/ddp-shipping-china-to-usa/"]
    ],
    faq: [
      ["What information is needed for an air freight quote?", "Send the product name, package count, dimensions, gross weight, pickup city, U.S. destination ZIP code and cargo-ready date."],
      ["Can air freight include door delivery?", "Yes. Door delivery can be included when the destination, customs scope and delivery conditions are confirmed in the quotation."],
      ["Is air freight always faster than ocean freight?", "Air freight usually has a shorter international transport window, but the complete schedule also depends on pickup, space, customs and final delivery."]
    ]
  },
  "sea-freight-china-to-usa": {
    navTitle: "Sea Freight",
    category: "International Freight & Delivery",
    eyebrow: "China-to-USA ocean freight",
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
    operations: [
      "Coordinate supplier pickup and origin handoffs in China.",
      "Compare FCL, LCL and multi-supplier consolidation options.",
      "Arrange the agreed export and ocean-freight scope.",
      "Coordinate customs handoff and delivery to the confirmed U.S. destination."
    ],
    boundaries: [
      "Sailing schedules, space and port conditions are confirmed for each booking.",
      "Customs acceptance, examinations and carrier-controlled events are not guaranteed.",
      "Cargo compatibility, packaging and special equipment must be reviewed before consolidation or loading."
    ],
    customerInputs: [
      "Product and packaging description",
      "Supplier locations and cargo-ready dates",
      "Package count, volume, dimensions and gross weight",
      "U.S. destination, access and unloading requirements"
    ],
    costFactors: [
      "FCL, LCL or consolidation plan",
      "Origin pickups and port routing",
      "Cargo volume, weight and handling",
      "Customs and final-delivery scope"
    ],
    startSteps: [
      "Share the cargo list and supplier locations.",
      "Compare FCL, LCL and consolidation where relevant.",
      "Confirm what the quotation includes and excludes.",
      "Coordinate booking, origin handoffs and final delivery."
    ],
    quoteNeeds: ["shipping"],
    shippingMethod: "ocean-freight",
    relatedServices: [
      ["Supplier Pickup & Consolidation", "/services/supplier-consolidation/"],
      ["DDP Door-to-Door", "/services/ddp-shipping-china-to-usa/"],
      ["Oversized Cargo", "/services/oversized-cargo-shipping/"]
    ],
    faq: [
      ["Should I choose FCL or LCL?", "The right option depends on volume, cargo characteristics, handling risk and the total delivered cost. Both should be compared for larger LCL shipments."],
      ["Can you collect from more than one supplier?", "Multi-supplier pickup and consolidation can be planned when supplier locations, cargo-ready dates and package details are available."],
      ["Can sea freight include final U.S. delivery?", "Yes. The quotation can include delivery to a business, warehouse, Amazon FBA location or project site when the address and delivery conditions are confirmed."]
    ]
  },
  "ddp-shipping-china-to-usa": {
    navTitle: "DDP Door-to-Door",
    category: "International Freight & Delivery",
    eyebrow: "Scope-defined door delivery",
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
    operations: [
      "Coordinate the agreed supplier pickup and origin handling.",
      "Define the international transport, customs and delivery scope in the quotation.",
      "Review commodity and document requirements before booking.",
      "Coordinate the agreed handoffs through final delivery."
    ],
    boundaries: [
      "DDP suitability depends on the product, value, importer requirements and destination.",
      "Duties, taxes, examinations, storage and accessorial charges are included only when stated in the quotation.",
      "A DDP quotation does not remove the need for accurate commercial and customs information."
    ],
    customerInputs: [
      "Product description, value and commercial documents",
      "Pickup location and cargo-ready date",
      "Package count, dimensions, weight and volume",
      "Exact delivery address and site conditions"
    ],
    costFactors: [
      "Commodity, declared value and customs scope",
      "Freight mode and shipment size",
      "Origin and destination handling",
      "Delivery access, appointment and unloading needs"
    ],
    startSteps: [
      "Send the cargo and commercial details.",
      "Confirm importer and customs responsibilities.",
      "Review inclusions, exclusions and possible accessorial charges.",
      "Approve the shipment-specific plan before pickup."
    ],
    quoteNeeds: ["shipping"],
    shippingMethod: "not-sure",
    relatedServices: [
      ["Sea Freight", "/services/sea-freight-china-to-usa/"],
      ["Air Freight", "/services/air-freight-china-to-usa/"],
      ["Supplier Pickup & Consolidation", "/services/supplier-consolidation/"]
    ],
    faq: [
      ["What should a DDP quote include?", "The quote should identify pickup, export handling, international freight, customs-related scope, duties or taxes where applicable, delivery and possible exclusions."],
      ["Is every product suitable for DDP shipping?", "No. Product restrictions, customs requirements, value and importer responsibilities must be reviewed before confirming a DDP plan."],
      ["How should I compare DDP quotations?", "Compare the same cargo details and delivery scope, then check duties, inspection charges, residential or liftgate fees, storage and other exclusions."]
    ]
  },
  "amazon-fba-shipping": {
    navTitle: "FBA Prep & Shipping",
    category: "China Operations & International Delivery",
    eyebrow: "FBA and e-commerce support",
    title: "Amazon FBA Shipping, Prep & Labeling from China",
    description:
      "FBA prep, FNSKU and carton labeling, repacking and China-to-USA delivery coordination for Amazon sellers.",
    summary:
      "China-side preparation and freight coordination for sellers who need inventory handled to confirmed instructions and delivered to the assigned Amazon receiving location.",
    bestFor: [
      "Inventory moving from one or multiple suppliers in China",
      "Products needing confirmed FNSKU or outer-carton labels",
      "Cargo needing repacking, polybagging or consolidation",
      "Air or ocean freight to an assigned U.S. FBA location"
    ],
    operations: [
      "Coordinate supplier pickup, receiving and multi-supplier consolidation.",
      "Apply customer-confirmed FNSKU and outer-carton label files.",
      "Arrange agreed repacking, carton changes or polybagging.",
      "Coordinate international freight and delivery to the assigned FBA destination."
    ],
    boundaries: [
      "The seller provides final approved label files, shipment data and destination instructions.",
      "Platform requirements must be checked for the destination market and current shipment; acceptance is not guaranteed unconditionally.",
      "Receiving checks do not replace a separately agreed product-quality inspection."
    ],
    customerInputs: [
      "Product list, quantities and supplier locations",
      "Final FNSKU, carton and shipment label files",
      "Packaging or prep instructions and any reference sample",
      "Assigned destination and freight requirements"
    ],
    costFactors: [
      "Number of units, cartons and label types",
      "Repacking, polybagging and material requirements",
      "Number of suppliers and receiving events",
      "Freight mode and destination delivery scope"
    ],
    startSteps: [
      "Share the product, supplier and destination details.",
      "Confirm the label files and handling instructions.",
      "Review a project-specific operation and freight quotation.",
      "Approve the requirements before cargo is released for handling."
    ],
    quoteNeeds: ["shipping", "fba-prep-labeling", "repacking"],
    shippingMethod: "not-sure",
    relatedServices: [
      ["Kitting & Light Assembly", "/services/kitting-light-assembly/"],
      ["Supplier Pickup & Consolidation", "/services/supplier-consolidation/"],
      ["Warehousing & Inventory Coordination", "/services/warehousing-inventory-coordination/"]
    ],
    faq: [
      ["Can you apply FNSKU and carton labels?", "Yes. Labeling can be arranged using the final files and placement instructions confirmed by the customer."],
      ["Do you guarantee Amazon will accept every shipment?", "No. Platform requirements and shipment data must be checked for the current destination, and final acceptance remains subject to the platform's receiving process."],
      ["Can goods from several suppliers be combined?", "Yes, when supplier-ready dates and package details allow a coordinated consolidation plan."],
      ["What information is required for a quote?", "Send pickup locations, carton count, dimensions, weight, commodity, cargo-ready date and the assigned FBA destination or delivery region."]
    ]
  },
  "oversized-cargo-shipping": {
    navTitle: "Oversized Cargo",
    category: "International Freight & Delivery",
    eyebrow: "Large and complex cargo",
    title: "Oversized Cargo Shipping from China to the USA",
    description:
      "Oversized and complex cargo shipping from China to the USA with packing, loading and final delivery planning.",
    summary:
      "Shipment planning for large, heavy or difficult cargo where dimensions, lifting points, packaging, route access and delivery equipment must be reviewed together.",
    heroMedia: {
      base: "/good-shipping-homepage/assets/operations/specialist-lifting",
      widths: [480, 800, 1200],
      fallbackWidth: 1200,
      width: 1200,
      height: 800,
      alt: "Truck-mounted lifting equipment positioned for cargo handling at an indoor handoff.",
      caption: "Specialist lifting equipment at a cargo handoff. Location, provider and operating responsibility are confirmed per shipment."
    },
    supportingMedia: {
      base: "/good-shipping-homepage/assets/operations/packing-preparation",
      widths: [480, 800, 1000],
      fallbackWidth: 1000,
      width: 1000,
      height: 563,
      alt: "Large wooden shipping crates prepared for cargo handling.",
      title: "Packaging is reviewed against the actual cargo",
      copy: "Packed dimensions, lifting points, crate condition and the proposed loading method are reviewed before equipment or routing is confirmed. This is a planning review, not a packaging certification."
    },
    bestFor: [
      "Machinery and industrial equipment",
      "Large furniture and commercial fixtures",
      "Crated cargo requiring special handling",
      "Project cargo with site-access constraints"
    ],
    operations: [
      "Review exact packed dimensions, weights and available cargo photos.",
      "Check packaging, lifting points and proposed loading method.",
      "Coordinate required carrier, loading or unloading handoffs.",
      "Plan international transport and final delivery around confirmed access conditions."
    ],
    boundaries: [
      "Equipment, permits and specialist handling depend on the cargo and route and must be confirmed before movement.",
      "Packaging review is based on the information provided and is not a product certification.",
      "Site access, unloading responsibility and appointment requirements must be agreed in advance."
    ],
    customerInputs: [
      "Exact packed dimensions and gross weight per piece",
      "Cargo, packaging and lifting-point photos",
      "Pickup-site loading capability",
      "Delivery-site access and unloading plan"
    ],
    costFactors: [
      "Size, weight and equipment selection",
      "Packing or reinforcement requirements",
      "Origin and destination access",
      "Route, permits and specialist handoffs where applicable"
    ],
    startSteps: [
      "Send the packed cargo data and photos.",
      "Confirm loading and delivery-site conditions.",
      "Review the proposed equipment, routing and service scope.",
      "Approve responsibilities before pickup."
    ],
    quoteNeeds: ["shipping"],
    shippingMethod: "not-sure",
    relatedServices: [
      ["Sea Freight", "/services/sea-freight-china-to-usa/"],
      ["Cargo Inspection & Receiving Checks", "/services/cargo-inspection-receiving-checks/"],
      ["DDP Door-to-Door", "/services/ddp-shipping-china-to-usa/"]
    ],
    faq: [
      ["What photos are useful for planning?", "Provide the cargo, packaging, lifting points, nameplate where relevant, pickup access and delivery-site access."],
      ["Can oversized cargo be delivered to a project site?", "It may be possible after the site address, access, unloading equipment and appointment requirements are reviewed."],
      ["Why are exact dimensions important?", "Packed dimensions and weight affect equipment choice, route feasibility, handling method and total delivered cost."]
    ]
  },
  "supplier-consolidation": {
    navTitle: "Pickup & Consolidation",
    category: "China Operations",
    eyebrow: "China-side supplier coordination",
    title: "Supplier Pickup & Consolidation in China",
    description:
      "Coordinate factory pickup, receiving checks and multi-supplier consolidation in China before international shipping.",
    summary:
      "A coordinated workflow for buyers who need cargo collected from one or more Chinese suppliers, checked against the agreed handoff record and released under one shipping plan.",
    heroMedia: {
      base: "/good-shipping-homepage/assets/operations/consolidation-staging",
      widths: [480, 800, 1000],
      fallbackWidth: 1000,
      width: 1000,
      height: 750,
      alt: "Mixed crates and packaged cargo staged inside a consolidation facility.",
      caption: "Crates and packaged cargo in a handling area. Supplier and shipment details are confirmed separately."
    },
    bestFor: [
      "Importers buying from several factories",
      "Mixed products with different cargo-ready dates",
      "Buyers comparing combined FCL or LCL options",
      "Shipments needing agreed receiving and package checks before export"
    ],
    operations: [
      "Coordinate pickup from the confirmed factory or supplier locations.",
      "Register arrivals and check package count against the customer-provided packing list.",
      "Coordinate cargo from different suppliers in one consolidation plan.",
      "Combine or split releases according to the confirmed shipping instructions."
    ],
    boundaries: [
      "Receiving checks cover the agreed package-level information and visible condition; they are not automatically a product-quality inspection.",
      "Storage time, repacking and special handling are quoted according to the cargo and instructions.",
      "Cargo compatibility and supplier readiness must be reviewed before a combined shipment is confirmed."
    ],
    customerInputs: [
      "Supplier contacts, pickup addresses and cargo-ready dates",
      "Packing lists and expected package quantities",
      "Product and packaging descriptions",
      "Release, consolidation and destination instructions"
    ],
    costFactors: [
      "Number and location of suppliers",
      "Pickup distance and receiving events",
      "Storage duration and handling steps",
      "Consolidation, split-release and shipping requirements"
    ],
    startSteps: [
      "Create the supplier and cargo-readiness list.",
      "Share packing lists and pickup contacts.",
      "Confirm the receiving, storage and release scope.",
      "Coordinate the agreed pickups and shipment plan."
    ],
    quoteNeeds: ["supplier-pickup", "consolidation"],
    shippingMethod: "not-sure",
    relatedServices: [
      ["Warehousing & Inventory Coordination", "/services/warehousing-inventory-coordination/"],
      ["Cargo Inspection & Receiving Checks", "/services/cargo-inspection-receiving-checks/"],
      ["Sea Freight", "/services/sea-freight-china-to-usa/"]
    ],
    faq: [
      ["What supplier details should I provide?", "Provide supplier contacts, pickup addresses, cargo-ready dates, product names, package counts, dimensions, weights and invoice information."],
      ["Does consolidation always reduce cost?", "Not always. Pickup distance, storage time, handling and cargo compatibility should be included in the comparison."],
      ["Can incompatible cargo be combined?", "Some products should be separated because of safety, customs, handling or contamination risks. Cargo compatibility must be reviewed first."],
      ["Is receiving the same as a product inspection?", "No. Standard receiving can check package count, outer packaging, labels and visible damage against agreed instructions. A product-quality inspection must be scoped separately."]
    ]
  },
  "warehousing-inventory-coordination": {
    navTitle: "Warehousing & Inventory",
    category: "China Operations",
    eyebrow: "China-side storage coordination",
    title: "Warehousing & Inventory Coordination in China",
    description:
      "Coordinate receiving, temporary storage, inventory checks and planned cargo releases in China for international shipments.",
    summary:
      "A practical holding and release workflow for buyers whose suppliers finish at different times or whose cargo needs to move under a staged shipping plan.",
    heroMedia: {
      base: "/good-shipping-homepage/assets/operations/warehouse-crates",
      widths: [480, 800, 1150],
      fallbackWidth: 1150,
      width: 1150,
      height: 862,
      alt: "Wooden export crates stored inside a cargo handling area.",
      caption: "Crated cargo in a handling area. Facility model, storage conditions and release scope are confirmed per project."
    },
    bestFor: [
      "Buyers collecting cargo from multiple suppliers",
      "Shipments with different production-ready dates",
      "Inventory that needs temporary storage before export",
      "Projects requiring planned full or partial releases"
    ],
    operations: [
      "Register incoming cargo against the agreed supplier and packing-list information.",
      "Coordinate temporary storage according to cargo and handling requirements.",
      "Check recorded package quantities before a planned release.",
      "Arrange full or partial release according to confirmed shipping instructions."
    ],
    boundaries: [
      "Storage acceptance, duration and conditions depend on the product, packaging and available arrangement.",
      "No real-time inventory system, customer API or automatic platform synchronization is promised.",
      "Package-level records do not replace a separately agreed product-quality inspection."
    ],
    customerInputs: [
      "Supplier and inbound shipment list",
      "Packing lists and expected package quantities",
      "Storage, stacking and handling requirements",
      "Release schedule and destination instructions"
    ],
    costFactors: [
      "Cargo volume, weight and storage duration",
      "Number of inbound and outbound events",
      "Handling, stacking and special storage requirements",
      "Inventory checks and split-release instructions"
    ],
    startSteps: [
      "Share the inbound cargo and supplier plan.",
      "Confirm storage conditions and expected duration.",
      "Agree how arrivals and releases will be recorded.",
      "Approve the handling and shipping schedule."
    ],
    quoteNeeds: ["warehousing"],
    shippingMethod: "not-sure",
    relatedServices: [
      ["Supplier Pickup & Consolidation", "/services/supplier-consolidation/"],
      ["Cargo Inspection & Receiving Checks", "/services/cargo-inspection-receiving-checks/"],
      ["Kitting & Light Assembly", "/services/kitting-light-assembly/"]
    ],
    faq: [
      ["Can cargo from different suppliers be stored together?", "It can be coordinated after the products, package data, arrival timing and compatibility are reviewed."],
      ["Do customers receive real-time inventory access?", "No real-time portal or API is promised. The reporting format and update points are agreed for the project."],
      ["Can cargo be released in stages?", "Yes, when the quantities, destinations and release instructions are confirmed in advance."]
    ]
  },
  "kitting-light-assembly": {
    navTitle: "Kitting & Light Assembly",
    category: "China Operations",
    eyebrow: "Project-defined product preparation",
    title: "Kitting & Light Assembly in China",
    description:
      "Coordinate component receiving, kitting, inserts, accessories, packing and simple assembly in China to confirmed instructions.",
    summary:
      "Project-based preparation for buyers who need components from one or more suppliers combined into a defined set before international shipping.",
    bestFor: [
      "E-commerce bundles and promotional sets",
      "Products combining components from several suppliers",
      "Kits that require instructions or accessories to be added",
      "Simple assembly and final packing to confirmed samples"
    ],
    operations: [
      "Coordinate receipt of the required components from confirmed suppliers.",
      "Combine items into sets using the approved bill of materials or instructions.",
      "Add confirmed instructions, accessories or inserts.",
      "Arrange agreed packing and simple assembly before release."
    ],
    boundaries: [
      "Complexity, tools, samples and acceptance criteria are agreed by project before work starts.",
      "This service does not imply engineering validation, product certification or unrestricted manufacturing capability.",
      "Product-quality testing or full inspection is separate unless specifically scoped."
    ],
    customerInputs: [
      "Bill of materials and quantity per kit",
      "Step-by-step instructions or approved reference sample",
      "Packaging, inserts, accessories and label files",
      "Acceptance criteria and release schedule"
    ],
    costFactors: [
      "Number of components and steps per kit",
      "Materials, labels and packaging required",
      "Sample confirmation and checking requirements",
      "Total quantity and release schedule"
    ],
    startSteps: [
      "Share the kit structure and component list.",
      "Confirm instructions, materials and acceptance criteria.",
      "Review whether a sample or trial run is needed.",
      "Approve the project scope before bulk handling."
    ],
    quoteNeeds: ["kitting-light-assembly"],
    shippingMethod: "not-sure",
    relatedServices: [
      ["FBA Prep & Shipping", "/services/amazon-fba-shipping/"],
      ["Warehousing & Inventory Coordination", "/services/warehousing-inventory-coordination/"],
      ["Cargo Inspection & Receiving Checks", "/services/cargo-inspection-receiving-checks/"]
    ],
    faq: [
      ["What counts as light assembly?", "Simple, repeatable steps can be reviewed from the instructions, components, tools and acceptance criteria. The exact scope is confirmed per project."],
      ["Is a sample required?", "A reference sample or trial may be required when written instructions are not enough to confirm the expected result."],
      ["Can components come from several suppliers?", "Yes. Supplier readiness, quantities and component compatibility are coordinated before the kitting schedule is confirmed."]
    ]
  },
  "cargo-inspection-receiving-checks": {
    navTitle: "Inspection & Receiving Checks",
    category: "China Operations",
    eyebrow: "Defined checks before release",
    title: "Cargo Inspection & Receiving Checks in China",
    description:
      "Arrange receiving checks for quantities, outer cartons, labels and visible damage, with product-quality inspection scoped separately.",
    summary:
      "Defined checks for buyers who need clearer information about received cargo before storage, consolidation, preparation or export.",
    bestFor: [
      "Multi-supplier consolidation projects",
      "Cargo needing packing-list quantity checks",
      "Shipments with label or outer-carton requirements",
      "Projects requiring a separately defined product inspection"
    ],
    operations: [
      "Check received package quantities against the customer-provided packing list.",
      "Review outer-carton condition and visible damage at the agreed receiving stage.",
      "Check agreed labels or package markings against customer-provided references.",
      "Coordinate a separately scoped product-quality inspection when requested and confirmed."
    ],
    boundaries: [
      "Standard receiving checks are not the same as professional quality inspection, laboratory testing or certification.",
      "No AQL qualification, laboratory capability or automatic 100% inspection is claimed.",
      "Sampling method, product checks, tolerances and reporting must be agreed before a quality inspection begins."
    ],
    customerInputs: [
      "Packing list and expected quantities",
      "Approved label or packaging references",
      "Inspection points, tolerances and sample method if product checks are requested",
      "Action instructions for shortages, visible damage or nonconformities"
    ],
    costFactors: [
      "Number of packages or units to check",
      "Check points, sampling and reporting requirements",
      "Product complexity and tools required",
      "Location, timing and recheck requirements"
    ],
    startSteps: [
      "Choose receiving checks or a separately scoped product inspection.",
      "Share the packing list, references and check points.",
      "Confirm sampling, evidence and exception-handling requirements.",
      "Approve the scope before cargo is checked or released."
    ],
    quoteNeeds: ["inspection"],
    quoteInspectionTypes: ["receiving-checks"],
    shippingMethod: "not-sure",
    relatedServices: [
      ["Supplier Pickup & Consolidation", "/services/supplier-consolidation/"],
      ["Warehousing & Inventory Coordination", "/services/warehousing-inventory-coordination/"],
      ["FBA Prep & Shipping", "/services/amazon-fba-shipping/"]
    ],
    faq: [
      ["What is included in a receiving check?", "The agreed scope can cover package quantity, outer-carton condition, labels and visible damage against customer-provided references."],
      ["Is a receiving check a quality inspection?", "No. Product checks, sampling, tolerances and reporting require a separately confirmed inspection scope."],
      ["Do you promise AQL or laboratory testing?", "No such capability is claimed on this site. Any specialized requirement must be reviewed and confirmed for the project."]
    ]
  }
};

export const destinations = {
  hawaii: {
    title: "Shipping from China to Hawaii",
    description:
      "Plan ocean or air freight from China to Hawaii with customs coordination and final delivery requirements reviewed before booking.",
    summary:
      "Freight planning for commercial cargo moving from Chinese suppliers to a confirmed address in Hawaii, with the island, route and final-delivery conditions reviewed in the quote.",
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
      "Shipping coordination for cargo moving from Chinese suppliers to a confirmed address in Alaska, where onward routing, weather exposure and site access may affect the plan.",
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
      "Ocean or air freight planning for commercial cargo moving from Chinese suppliers to a confirmed address in Puerto Rico, with documentation and final-delivery requirements reviewed in advance.",
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
    title: "Oversized Cargo Shipping from China to the USA",
    description: "Plan dimensions, packaging, lifting, routing and final-delivery requirements before quoting.",
    href: "/services/oversized-cargo-shipping/",
    ctaLabel: "View oversized cargo service"
  },
  {
    title: "DDP Shipping from China to the USA",
    description: "Review the quoted scope, exclusions and customs-sensitive responsibilities before booking.",
    href: "/services/ddp-shipping-china-to-usa/",
    ctaLabel: "View DDP service"
  },
  {
    title: "Supplier Pickup & Consolidation",
    description: "See how pickup, receiving checks and consolidation can be scoped for multiple suppliers.",
    href: "/services/supplier-consolidation/",
    ctaLabel: "View consolidation service"
  },
  {
    title: "Shipping from China to Hawaii",
    description: "Route, cargo and final-delivery questions to confirm before booking.",
    href: "/destinations/hawaii/",
    ctaLabel: "View Hawaii destination"
  },
  {
    title: "Shipping from China to Puerto Rico",
    description: "Planning notes for documentation, routing and island delivery.",
    href: "/destinations/puerto-rico/",
    ctaLabel: "View Puerto Rico destination"
  }
];
