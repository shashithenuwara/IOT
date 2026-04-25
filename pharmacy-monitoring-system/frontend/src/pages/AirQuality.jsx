import SensorPage from "../components/SensorPage";

export default function AirQuality() {
  return (
    <SensorPage
      badge="Sensor Detail"
      title="Air Quality"
      subtitle="Airborne particulate and volatile compound monitoring"
      sensorKey="airQuality"
      unit="ppm"
      type="airQuality"
      rangeInfo={{
        safe:     "< 200 ppm",
        warning:  "200 – 300 ppm",
        critical: "> 300 ppm",
        description: "Acceptable air quality for pharmaceutical storage is below 200 ppm of volatile compounds. Elevated levels indicate contamination risks that can compromise sterile products or cause cross-contamination between drug substances. Inspect HVAC filters, check for chemical sources, and ensure adequate air exchange.",
      }}
    />
  );
}
