export default function LightMonitoring({ data }) {
  return (
    <div>
      <h1>Light Monitoring</h1>

      <p>Current Light: {data.light} lux</p>

      <p>
        Status: {data.light > 150 ? "Danger" : "Safe"}
      </p>
    </div>
  );
}