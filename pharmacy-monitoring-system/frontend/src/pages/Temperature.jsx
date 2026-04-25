import SensorPage from "../components/SensorPage";

export default function Temperature() {
  return (
    <SensorPage
      badge="Sensor Detail"
      title="Temperature"
      subtitle="Storage temperature conditions and historical trend analysis"
      sensorKey="temperature"
      unit="°C"
      type="temperature"
      rangeInfo={{
        safe:     "15°C – 25°C",
        warning:  "16°C – 24°C (approaching limit)",
        critical: "< 15°C or > 25°C",
        description: "Pharmacy medicines must be stored between 15°C and 25°C. Temperatures outside this range can degrade active ingredients, reduce shelf life, or cause dangerous changes in formulation. If readings exceed limits, inspect cooling systems, check door seals, and review ventilation pathways.",
      }}
    />
  );
}
