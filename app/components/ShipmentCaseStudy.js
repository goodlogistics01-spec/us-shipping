export default function ShipmentCaseStudy({ study }) {
  if (!study) return null;

  const fields = [
    ["Cargo Type", study.cargoType],
    ["Origin", study.origin],
    ["Destination", study.destination],
    ["Shipping Mode", study.shippingMode],
    ["Container / Volume", study.containerVolume],
    ["Special Requirement", study.specialRequirement],
    ["Logistics Solution", study.logisticsSolution],
    ["Result", study.result]
  ];

  return (
    <section className="ocean-section ocean-case-study" aria-labelledby={`case-study-${study.id}`}>
      <div className="marketing-container">
        <p className="ocean-section-label">Verified shipment example</p>
        <h2 id={`case-study-${study.id}`}>{study.title}</h2>
        <dl>
          {fields.map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}
