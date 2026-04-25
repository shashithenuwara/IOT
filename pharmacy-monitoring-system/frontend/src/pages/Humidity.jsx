export default function Humidity({ data }) {
  return (
    <div>
      <h1>Humidity</h1>
      <p>Current Humidity: {data.humidity}%</p>
    </div>
  );
}
