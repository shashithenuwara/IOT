export default function Temperature({ data }) {
  return (
    <div>
      <h1>Temperature</h1>
      <p>Current Temperature: {data.temperature}°C</p>
      <p>
        Status: {data.temperature > 25 ? "High" : "Normal"}
      </p>
    </div>
  );
}