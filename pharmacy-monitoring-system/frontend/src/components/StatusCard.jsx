import { getStatusColor } from "../utils/thresholds";

export default function StatusCard({ title, value, unit, status }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "22px",
        padding: "24px",
        boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
        borderTop: `6px solid ${getStatusColor(status)}`,
      }}
    >
      <p style={{ color: "#64748b", fontWeight: "600" }}>{title}</p>

      <h2 style={{ fontSize: "36px", margin: "10px 0", color: "#0f172a" }}>
        {value} <span style={{ fontSize: "18px" }}>{unit}</span>
      </h2>

      <span
        style={{
          background: getStatusColor(status),
          color: "white",
          padding: "7px 14px",
          borderRadius: "999px",
          fontSize: "13px",
          fontWeight: "700",
        }}
      >
        {status}
      </span>
    </div>
  );
}