import { getStatusColor, getStatusBg } from "../utils/thresholds";

const SENSOR_ICONS = {
  temperature: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 11.5V4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="14.5" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="10" cy="14.5" r="1" fill="currentColor"/>
    </svg>
  ),
  humidity: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3L5.5 10.5a5 5 0 1 0 9 0L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  light: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  airQuality: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 6h10a2.5 2.5 0 000-5 2.5 2.5 0 00-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 10h12a2.5 2.5 0 000-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 14h8a2.5 2.5 0 010 5 2.5 2.5 0 01-2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

const SENSOR_COLORS = {
  temperature: "var(--temp-color)",
  humidity:    "var(--hum-color)",
  light:       "var(--light-color)",
  airQuality:  "var(--air-color)",
};

export default function StatusCard({ title, value, unit, status, type, onClick }) {
  const statusColor = getStatusColor(status);
  const accentColor = SENSOR_COLORS[type] || "var(--accent)";

  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = "1px solid var(--border-med)";
        e.currentTarget.style.background = "var(--bg-elevated)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = "1px solid var(--border)";
        e.currentTarget.style.background = "var(--bg-card)";
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "2px",
        background: accentColor,
        opacity: 0.6,
      }}/>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <span style={{
          color: "var(--text-secondary)",
          fontSize: "11.5px",
          fontWeight: "600",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}>
          {title}
        </span>
        <span style={{
          color: accentColor,
          opacity: 0.8,
        }}>
          {SENSOR_ICONS[type]}
        </span>
      </div>

      {/* Value */}
      <div style={{ marginBottom: "14px" }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "34px",
          fontWeight: "500",
          color: "var(--text-primary)",
          letterSpacing: "-1px",
          lineHeight: 1,
        }}>
          {typeof value === "number" ? value.toFixed(1) : "—"}
        </span>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "14px",
          color: "var(--text-secondary)",
          marginLeft: "4px",
        }}>
          {unit}
        </span>
      </div>

      {/* Status badge */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 10px",
        borderRadius: "20px",
        background: `${statusColor}14`,
        border: `1px solid ${statusColor}30`,
      }}>
        <div style={{
          width: "5px", height: "5px",
          borderRadius: "50%",
          background: statusColor,
        }}/>
        <span style={{
          fontSize: "11px",
          fontWeight: "600",
          color: statusColor,
          letterSpacing: "0.3px",
        }}>
          {status}
        </span>
      </div>
    </div>
  );
}
