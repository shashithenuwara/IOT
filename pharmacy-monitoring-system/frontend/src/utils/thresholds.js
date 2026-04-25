export function getSensorStatus(type, value) {
  if (value === undefined || value === null) return "Unknown";

  if (type === "temperature") {
    if (value > 25 || value < 15) return "Critical";
    if (value > 24 || value < 16) return "Warning";
    return "Safe";
  }

  if (type === "humidity") {
    if (value > 60 || value < 35) return "Critical";
    if (value > 55 || value < 40) return "Warning";
    return "Safe";
  }

  if (type === "light") {
    if (value > 150) return "Critical";
    if (value > 120) return "Warning";
    return "Safe";
  }

  if (type === "airQuality") {
    if (value > 300) return "Critical";
    if (value > 200) return "Warning";
    return "Safe";
  }

  return "Unknown";
}

export function getStatusColor(status) {
  if (status === "Safe") return "#16a34a";
  if (status === "Warning") return "#f59e0b";
  if (status === "Critical") return "#dc2626";
  return "#64748b";
}

export function generateAlerts(current) {
  const sensors = [
    ["temperature", "Temperature", current.temperature, "°C"],
    ["humidity", "Humidity", current.humidity, "%"],
    ["light", "Light", current.light, "lux"],
    ["airQuality", "Air Quality", current.airQuality, "ppm"],
  ];

  return sensors
    .map(([key, label, value, unit]) => {
      const status = getSensorStatus(key, value);
      return {
        key,
        label,
        value,
        unit,
        status,
        message:
  status === "Critical"
    ? `${label} is critically outside the safe range. Immediate action required.`
    : status === "Warning"
    ? `${label} is approaching unsafe levels. Monitor closely.`
    : `${label} is within safe range`
      };
    })
    .filter((alert) => alert.status !== "Safe");
}