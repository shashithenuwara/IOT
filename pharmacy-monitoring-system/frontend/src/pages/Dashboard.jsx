import ChatAssistant from "../components/ChatAssistant";
import { useEffect, useState } from "react";
import { subscribeToSensorData } from "../services/firebaseService";
import TrendChart from "../components/TrendChart";
import { getSensorStatus, getStatusColor, generateAlerts } from "../utils/thresholds";
import StatusCard from "../components/StatusCard";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [anomaly, setAnomaly] = useState(null);

  useEffect(() => {
    subscribeToSensorData(setData);
  }, []);

  useEffect(() => {
    async function checkAnomaly() {
      if (!data?.history || data.history.length < 30) return;

      try {
  const res = await fetch("http://127.0.0.1:5000/anomaly", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ history: data.history }),
  });

  const result = await res.json();
console.log("Anomaly result:", result);
setAnomaly(result);

} catch (error) {
  console.error("Anomaly request failed:", error);
  setAnomaly({
    anomaly: false,
    score: 0,
    message: "AI anomaly service unavailable",
  });
}
    }

    checkAnomaly();
  }, [data]);

  if (!data) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  const current = data.current;
  const history = data.history;

  const statuses = {
  temperature: getSensorStatus("temperature", current.temperature),
  humidity: getSensorStatus("humidity", current.humidity),
  light: getSensorStatus("light", current.light),
  airQuality: getSensorStatus("airQuality", current.airQuality),
};

function getTrend(data, key) {
  if (data.length < 2) return "stable";

  const first = data[0][key];
  const last = data[data.length - 1][key];

  if (last > first) return "increasing";
  if (last < first) return "decreasing";
  return "stable";
}

const alerts = generateAlerts(current);

  return (
  <div
    style={{
      minHeight: "100vh",
      background: "#f1f5f9",
      padding: "28px",
      color: "#0f172a",
      paddingBottom: "420px",
    }}
  >
    <h1 style={{ marginBottom: "22px" }}>Smart Medicine Storage Dashboard</h1>

    <div
      style={{
        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        color: "white",
        padding: "36px",
        borderRadius: "26px",
        marginBottom: "28px",
        boxShadow: "0 14px 28px rgba(37,99,235,0.25)",
      }}
    >
      <p style={{ fontWeight: "700", letterSpacing: "1px" }}>SYSTEM STATUS</p>
      <h2 style={{ fontSize: "40px", margin: "8px 0" }}>
        System Overview Dashboard
      </h2>
      <p style={{ fontSize: "16px", opacity: 0.9 }}>
        Real-time monitoring of pharmacy medicine storage conditions
      </p>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "28px",
      }}
    >
      <StatusCard title="Temperature Status" value={current.temperature} unit="°C" status={statuses.temperature} />
      <StatusCard title="Humidity Status" value={current.humidity} unit="%" status={statuses.humidity} />
      <StatusCard title="Light Level Status" value={current.light} unit="lux" status={statuses.light} />
      <StatusCard title="Air Quality Status" value={current.airQuality} unit="ppm" status={statuses.airQuality} />
    </div>

    {anomaly && (
      <div
        style={{
          background: anomaly.anomaly ? "#7f1d1d" : "#064e3b",
          color: "white",
          padding: "22px",
          borderRadius: "20px",
          marginBottom: "28px",
          boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
        }}
      >
        <h2>AI Anomaly Detection</h2>
        <p>{anomaly.message}</p>
        <p>Score: {Number(anomaly.score).toFixed(4)}</p>
      </div>
    )}

    <h2>Recent Alerts</h2>

    <div
      style={{
        background: "white",
        padding: "22px",
        borderRadius: "20px",
        boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
        marginBottom: "28px",
      }}
    >
      {alerts.length === 0 ? (
        <p>All sensor readings are currently within safe limits.</p>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert.key}
            style={{
              padding: "14px",
              marginBottom: "12px",
              borderRadius: "14px",
              background: "#f8fafc",
              borderLeft: `6px solid ${getStatusColor(alert.status)}`,
            }}
          >
            <strong>
              {alert.status}: {alert.label}
            </strong>
            <p style={{ margin: "6px 0 0", color: "#475569" }}>
              {alert.message}. Current value: {alert.value} {alert.unit}
            </p>
          </div>
        ))
      )}
    </div>

    <h2>Environmental Trends</h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "22px",
      }}
    >
      {[
        ["Temperature Trend", "temperature", "red"],
        ["Humidity Trend", "humidity", "blue"],
        ["Light Trend", "light", "orange"],
        ["Air Quality Trend", "airQuality", "green"],
      ].map(([title, key, color]) => (
        <div
          key={key}
          style={{
            background: "white",
            padding: "22px",
            borderRadius: "20px",
            boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
          }}
        >
          <h3>{title}</h3>
          <TrendChart data={history} dataKey={key} color={color} />
        </div>
      ))}
    </div>

    <div
  style={{
    position: "fixed",
    right: "30px",
    bottom: "30px",
    width: "340px",
    background: "#1e293b",
    borderRadius: "20px",
    padding: "16px",
    color: "white",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
  }}
>
  <ChatAssistant data={{ current, statuses, alerts, anomaly }} />
</div>
  </div>
);
}