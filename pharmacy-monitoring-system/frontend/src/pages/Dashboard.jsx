import { useEffect, useState } from "react";
import { subscribeToSensorData } from "../services/firebaseService";
import TrendChart from "../components/TrendChart";
import StatusCard from "../components/StatusCard";
import ChatAssistant from "../components/ChatAssistant";
import PageHeader from "../components/PageHeader";
import { getSensorStatus, getStatusColor, getStatusBg, generateAlerts } from "../utils/thresholds";

const SENSOR_CONFIG = [
  { key: "temperature", title: "Temperature", unit: "°C",  type: "temperature" },
  { key: "humidity",    title: "Humidity",    unit: "%",   type: "humidity"    },
  { key: "light",       title: "Light Level", unit: "lux", type: "light"       },
  { key: "airQuality",  title: "Air Quality", unit: "ppm", type: "airQuality"  },
];

const CHART_CONFIG = [
  { key: "temperature", label: "Temperature", unit: "°C"  },
  { key: "humidity",    label: "Humidity",    unit: "%"   },
  { key: "light",       label: "Light",       unit: "lux" },
  { key: "airQuality",  label: "Air Quality", unit: "ppm" },
];

function LoadingScreen() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", flexDirection: "column", gap: "16px",
    }}>
      <div style={{
        width: "36px", height: "36px",
        border: "2px solid var(--border)",
        borderTop: "2px solid var(--accent)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}/>
      <span style={{ color: "var(--text-muted)", fontSize: "13px", fontFamily: "var(--font-mono)" }}>
        Connecting to sensors...
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [anomaly, setAnomaly] = useState(null);

  useEffect(() => { subscribeToSensorData(setData); }, []);

  useEffect(() => {
    async function checkAnomaly() {
      if (!data?.history || data.history.length < 30) return;
      try {
        const res = await fetch("http://127.0.0.1:5000/anomaly", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history: data.history }),
        });
        const result = await res.json();
        setAnomaly(result);
      } catch {
        setAnomaly({ anomaly: false, score: 0, message: "AI anomaly service unavailable" });
      }
    }
    checkAnomaly();
  }, [data]);

  if (!data) return <LoadingScreen />;

  const { current, history } = data;
  const statuses = {
    temperature: getSensorStatus("temperature", current.temperature),
    humidity:    getSensorStatus("humidity",    current.humidity),
    light:       getSensorStatus("light",       current.light),
    airQuality:  getSensorStatus("airQuality",  current.airQuality),
  };
  const alerts = generateAlerts(current);
  const safeCount = Object.values(statuses).filter(s => s === "Safe").length;
  const healthScore = Math.round((safeCount / 4) * 100);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "48px" }}>
      <PageHeader
        badge="Live Monitoring"
        title="System Overview"
        subtitle="Real-time environmental conditions for pharmacy medicine storage"
      >
        {/* Health score badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: "10px 16px",
        }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.8px", textTransform: "uppercase", fontWeight: "600" }}>Health Score</div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "26px",
              fontWeight: "500",
              color: healthScore === 100 ? "var(--safe)" : healthScore >= 50 ? "var(--warning)" : "var(--critical)",
              lineHeight: 1.1,
            }}>
              {healthScore}<span style={{ fontSize: "14px", opacity: 0.6 }}>%</span>
            </div>
          </div>
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="var(--border)" strokeWidth="3"/>
            <circle
              cx="22" cy="22" r="18"
              fill="none"
              stroke={healthScore === 100 ? "var(--safe)" : healthScore >= 50 ? "var(--warning)" : "var(--critical)"}
              strokeWidth="3"
              strokeDasharray={`${(healthScore / 100) * 113} 113`}
              strokeDashoffset="28"
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.8s ease" }}
            />
          </svg>
        </div>
      </PageHeader>

      <div style={{ padding: "28px 36px" }}>
        {/* Status cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
          marginBottom: "24px",
        }}>
          {SENSOR_CONFIG.map(({ key, title, unit, type }) => (
            <StatusCard
              key={key}
              title={title}
              value={current[key]}
              unit={unit}
              status={statuses[key]}
              type={type}
            />
          ))}
        </div>

        {/* Anomaly banner */}
        {anomaly && (
          <div style={{
            background: anomaly.anomaly ? "var(--critical-bg)" : "var(--safe-bg)",
            border: `1px solid ${anomaly.anomaly ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
            borderRadius: "var(--radius-md)",
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}>
            <div style={{
              width: "36px", height: "36px",
              borderRadius: "var(--radius-sm)",
              background: anomaly.anomaly ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                {anomaly.anomaly
                  ? <path d="M9 1L1.5 15.5h15L9 1zM9 7v4M9 12.5v.5" stroke="var(--critical)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  : <path d="M15 5L7 13l-4-4" stroke="var(--safe)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                }
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "2px" }}>
                AI Anomaly Detection
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                {anomaly.message}
                {" — "}
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px" }}>
                  score: {Number(anomaly.score).toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
          {/* Alerts */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
          }}>
            <div style={{
              fontSize: "11px", fontWeight: "700", letterSpacing: "1px",
              color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              Active Alerts
              {alerts.length > 0 && (
                <span style={{
                  background: "var(--critical-bg)",
                  color: "var(--critical)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "20px",
                  padding: "2px 8px",
                  fontSize: "10px",
                  fontWeight: "700",
                }}>
                  {alerts.length}
                </span>
              )}
            </div>
            {alerts.length === 0 ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", padding: "28px 0", gap: "8px",
              }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="12" stroke="var(--safe)" strokeWidth="1.5" opacity="0.4"/>
                  <path d="M9 14l3.5 3.5L19 10" stroke="var(--safe)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>All conditions normal</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {alerts.map(alert => (
                  <div key={alert.key} style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-sm)",
                    background: getStatusBg(alert.status),
                    borderLeft: `3px solid ${getStatusColor(alert.status)}`,
                  }}>
                    <div style={{ fontSize: "12.5px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "3px" }}>
                      {alert.label}
                      <span style={{
                        marginLeft: "8px",
                        fontSize: "10px",
                        color: getStatusColor(alert.status),
                        fontWeight: "700",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}>{alert.status}</span>
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-secondary)" }}>
                      {alert.message}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: getStatusColor(alert.status),
                      marginTop: "4px",
                      opacity: 0.8,
                    }}>
                      {typeof alert.value === "number" ? alert.value.toFixed(1) : alert.value} {alert.unit}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
          }}>
            <div style={{
              fontSize: "11px", fontWeight: "700", letterSpacing: "1px",
              color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "16px",
            }}>
              Current Readings
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {SENSOR_CONFIG.map(({ key, title, unit, type }) => {
                const val = current[key];
                const st = statuses[key];
                return (
                  <div key={key} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border-soft)",
                  }}>
                    <span style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>{title}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px",
                        color: "var(--text-primary)",
                        fontWeight: "500",
                      }}>
                        {typeof val === "number" ? val.toFixed(1) : "—"} {unit}
                      </span>
                      <div style={{
                        width: "6px", height: "6px",
                        borderRadius: "50%",
                        background: getStatusColor(st),
                        flexShrink: 0,
                      }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trend charts */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "20px",
        }}>
          <div style={{
            fontSize: "11px", fontWeight: "700", letterSpacing: "1px",
            color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "20px",
          }}>
            Environmental Trends — Last 30 readings
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
            {CHART_CONFIG.map(({ key, label, unit }) => (
              <div key={key}>
                <div style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  marginBottom: "10px",
                  fontWeight: "600",
                }}>
                  {label}
                </div>
                <TrendChart data={history} dataKey={key} unit={unit} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ChatAssistant data={{ current, statuses, alerts, anomaly }} />
    </div>
  );
}
