export default function Alerts({ data }) {
  return (
    <div>
      <h1>Alerts</h1>
      <ul>
        {data.alerts.map((alert, index) => (
          <li key={index}>{alert}</li>
        ))}
      </ul>
    </div>
  );
}
