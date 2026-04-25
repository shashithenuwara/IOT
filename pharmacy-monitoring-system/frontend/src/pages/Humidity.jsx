import SensorPage from "../components/SensorPage";

export default function Humidity() {
  return (
    <SensorPage
      badge="Sensor Detail"
      title="Humidity"
      subtitle="Relative humidity levels and moisture trend analysis"
      sensorKey="humidity"
      unit="%"
      type="humidity"
      rangeInfo={{
        safe:     "40% – 55% RH",
        warning:  "35–40% or 55–60% RH",
        critical: "< 35% or > 60% RH",
        description: "Relative humidity between 40–55% is optimal for most pharmaceutical storage. Excessive moisture promotes microbial growth and chemical degradation; too little causes desiccation of hygroscopic products. If readings are high, check dehumidifiers and inspect for water ingress.",
      }}
    />
  );
}
