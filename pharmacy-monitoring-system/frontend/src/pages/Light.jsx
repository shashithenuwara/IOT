import SensorPage from "../components/SensorPage";

export default function Light() {
  return (
    <SensorPage
      badge="Sensor Detail"
      title="Light Level"
      subtitle="Ambient light exposure and illumination trend analysis"
      sensorKey="light"
      unit="lux"
      type="light"
      rangeInfo={{
        safe:     "< 120 lux",
        warning:  "120 – 150 lux",
        critical: "> 150 lux",
        description: "Many pharmaceuticals are photosensitive and should be stored below 120 lux. Prolonged exposure to bright light can cause photodegradation, altering drug efficacy and safety. Ensure storage areas have adequate UV shielding and opaque packaging for light-sensitive compounds.",
      }}
    />
  );
}
