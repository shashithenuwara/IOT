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
  if (status === "Safe")     return "var(--safe)";
  if (status === "Warning")  return "var(--warning)";
  if (status === "Critical") return "var(--critical)";
  return "var(--unknown)";
}

export function getStatusBg(status) {
  if (status === "Safe")     return "var(--safe-bg)";
  if (status === "Warning")  return "var(--warning-bg)";
  if (status === "Critical") return "var(--critical-bg)";
  return "rgba(100,116,139,0.08)";
}

export function generateAlerts(current) {
  const sensors = [
    ["temperature", "Temperature",  current.temperature, "°C"],
    ["humidity",    "Humidity",      current.humidity,    "%"],
    ["light",       "Light",         current.light,       "lux"],
    ["airQuality",  "Air Quality",   current.airQuality,  "ppm"],
  ];
  return sensors
    .map(([key, label, value, unit]) => {
      const status = getSensorStatus(key, value);
      return {
        key, label, value, unit, status,
        message:
          status === "Critical"
            ? `${label} is critically outside safe range. Immediate action required.`
            : status === "Warning"
            ? `${label} is approaching unsafe levels. Monitor closely.`
            : `${label} is within safe range`,
      };
    })
    .filter(a => a.status !== "Safe");
}
