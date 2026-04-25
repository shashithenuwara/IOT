import TrendChart from "./TrendChart";

export default function ChartCard({ title, data, dataKey, color }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
      }}
    >
      <h3 style={{ marginBottom: "16px" }}>{title}</h3>
      <TrendChart data={data} dataKey={dataKey} color={color} />
    </div>
  );
}