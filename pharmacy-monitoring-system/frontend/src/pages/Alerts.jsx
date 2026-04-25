import { useEffect, useState } from "react";
import { subscribeToSensorData } from "../services/firebaseService";
import PageHeader from "../components/PageHeader";
import { generateAlerts, getStatusColor, getStatusBg } from "../utils/thresholds";

const ALL_SENSORS = ["temperature", "humidity", "light", "airQuality"];
const SENSOR_LABELS = {
  temperature: "Temperature",
  humidity: "Humidity",
  light: "Light Level",
  airQuality: "Air Quality",
};
const SENSOR_UNITS = {
  temperature: "°C",
  humidity: "%",
  light: "lux",
  airQuality: "ppm",
};

export default function Alerts() {
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

  const alerts = generateAlerts(data.current);
  const critical = alerts.filter(a => a.status === "Critical");
  const warning = alerts.filter(a => a.status === "Warning");

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "48px" }}>
      <PageHeader
        badge="Alert Center"
        title="Alerts"
        subtitle="Active conditions requiring attention based on live sensor readings"
      />

      <div style={{ padding: "28px 36px" }}>
        {/* Summary row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "24px" }}>
          {[
            { label: "Total Alerts",    count: alerts.length,   color: alerts.length > 0 ? "var(--warning)" : "var(--safe)" },
            { label: "Critical",        count: critical.length, color: "var(--critical)" },
            { label: "Warning",         count: warning.length,  color: "var(--warning)"  },
          ].map(({ label, count, color }) => (
            <div key={label} style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
            }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "8px" }}>{label}</div>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "38px",
                fontWeight: "500",
                color: count > 0 ? color : "var(--text-muted)",
                letterSpacing: "-1px",
              }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Alerts list */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            fontSize: "11px", fontWeight: "700", letterSpacing: "1px",
            color: "var(--text-muted)", textTransform: "uppercase",
          }}>
            Active Alerts
          </div>

          {alerts.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "64px 0", gap: "16px",
            }}>
              <div style={{
                width: "56px", height: "56px",
                borderRadius: "50%",
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="var(--safe)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "4px" }}>All systems normal</div>
                <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>All environmental conditions are currently within safe limits.</div>
              </div>
            </div>
          ) : (
            <div>
              {alerts.map((alert, i) => (
                <div key={alert.key} style={{
                  padding: "18px 20px",
                  borderBottom: i < alerts.length - 1 ? "1px solid var(--border-soft)" : "none",
                  display: "flex", gap: "16px", alignItems: "flex-start",
                }}>
                  {/* Status indicator */}
                  <div style={{
                    width: "36px", height: "36px",
                    borderRadius: "var(--radius-sm)",
                    background: getStatusBg(alert.status),
                    border: `1px solid ${getStatusColor(alert.status)}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      {alert.status === "Critical"
                        ? <path d="M8 1L1 14h14L8 1zM8 6v4M8 11.5v.5" stroke={getStatusColor(alert.status)} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        : <path d="M8 3v5M8 9.5v1" stroke={getStatusColor(alert.status)} strokeWidth="1.3" strokeLinecap="round"/>
                      }
                    </svg>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-primary)" }}>
                        {alert.label}
                      </span>
                      <span style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        letterSpacing: "0.5px",
                        color: getStatusColor(alert.status),
                        background: getStatusBg(alert.status),
                        border: `1px solid ${getStatusColor(alert.status)}30`,
                        borderRadius: "20px",
                        padding: "2px 8px",
                        textTransform: "uppercase",
                      }}>
                        {alert.status}
                      </span>
                    </div>
                    <p style={{ fontSize: "12.5px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                      {alert.message}
                    </p>
                  </div>

                  {/* Value */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "20px",
                      fontWeight: "500",
                      color: getStatusColor(alert.status),
                      letterSpacing: "-0.5px",
                      lineHeight: 1,
                    }}>
                      {typeof alert.value === "number" ? alert.value.toFixed(1) : alert.value}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {alert.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
