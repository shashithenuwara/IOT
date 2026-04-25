export default function AirQuality({ data }) {
  return (
    <div>
      <h1>Air Quality</h1>
        <p>Current Air Quality Index: {data.airQuality}</p>
        <p>
          Status: {data.airQuality > 100 ? "Poor" : "Good"}
        </p>    
    </div>
  );
}