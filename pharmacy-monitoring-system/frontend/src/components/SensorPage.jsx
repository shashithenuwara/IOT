import { useEffect, useState } from "react";
import { subscribeToSensorData } from "../services/firebaseService";
import TrendChart from "./TrendChart";
import StatusCard from "./StatusCard";
import PageHeader from "./PageHeader";
import { getSensorStatus } from "../utils/thresholds";

export default function SensorPage({
  title,
  subtitle,
  sensorKey,
  unit,
  type,
  rangeInfo,
  badge,
  stats,
}) {
  const [data, setData] = useState(null);
  useEffect(() => { subscribeToSensorData(setData); }, []);

  if (!data) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{
        width: "30px", height: "30px",
        border: "2px solid var(--border)",
        borderTop: "2px solid var(--accent)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );

  const { current, history } = data;
  const value = current[sensorKey];
  const status = getSensorStatus(sensorKey, value);

  const histValues = history.map(h => h[sensorKey]).filter(v => v != null);
  const avg = histValues.length ? (histValues.reduce((a, b) => a + b, 0) / histValues.length).toFixed(1) : "—";
  const min = histValues.length ? Math.min(...histValues).toFixed(1) : "—";
  const max = histValues.length ? Math.max(...histValues).toFixed(1) : "—";

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "48px" }}>
      <PageHeader badge={badge} title={title} subtitle={subtitle} />

      <div style={{ padding: "28px 36px" }}>
        {/* Current + mini stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "14px", marginBottom: "24px" }}>
          <StatusCard title={`Current ${title}`} value={value} unit={unit} status={status} type={type} />
          {[
            { label: "30-reading Avg", val: avg, u: unit },
            { label: "Period Min", val: min, u: unit },
            { label: "Period Max", val: max, u: unit },
          ].map(({ label, val, u }) => (
            <div key={label} style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
            }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "12px" }}>{label}</div>
              <div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "28px", fontWeight: "500", color: "var(--text-primary)", letterSpacing: "-0.5px" }}>{val}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text-secondary)", marginLeft: "4px" }}>{u}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "20px",
          marginBottom: "24px",
        }}>
          <div style={{
            fontSize: "11px", fontWeight: "700", letterSpacing: "1px",
            color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "16px",
          }}>
            {title} Trend — Last 30 readings
          </div>
          <TrendChart data={history} dataKey={sensorKey} unit={unit} height={220} />
        </div>

        {/* Range info */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>
              Safe Range Reference
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { label: "Safe",     range: rangeInfo.safe,     color: "var(--safe)" },
                { label: "Warning",  range: rangeInfo.warning,  color: "var(--warning)" },
                { label: "Critical", range: rangeInfo.critical, color: "var(--critical)" },
              ].map(({ label, range, color }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  background: `${color}08`,
                  border: `1px solid ${color}20`,
                }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0 }}/>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", flex: 1 }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: color }}>{range}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "1px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>
              Decision Support
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {rangeInfo.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
