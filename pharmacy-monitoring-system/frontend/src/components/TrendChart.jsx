import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const SENSOR_COLORS = {
  temperature: "#ff6b6b",
  humidity:    "#4eb8ff",
  light:       "#fbbf24",
  airQuality:  "#34d399",
};

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-med)",
      borderRadius: "var(--radius-sm)",
      padding: "8px 12px",
      fontFamily: "var(--font-mono)",
      fontSize: "12px",
    }}>
      <div style={{ color: "var(--text-muted)", marginBottom: "2px" }}>{label}</div>
      <div style={{ color: "var(--text-primary)", fontWeight: "500" }}>
        {typeof val === "number" ? val.toFixed(1) : val} {unit}
      </div>
    </div>
  );
}

export default function TrendChart({ data, dataKey, unit, height = 180 }) {
  const color = SENSOR_COLORS[dataKey] || "var(--accent)";

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.18}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)"/>
          <XAxis
            dataKey="time"
            tick={{ fill: "#3d5068", fontFamily: "var(--font-mono)", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "#3d5068", fontFamily: "var(--font-mono)", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip unit={unit} />}/>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#grad-${dataKey})`}
            dot={false}
            activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
