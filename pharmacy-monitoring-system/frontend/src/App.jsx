import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LightMonitoring from "./pages/LightMonitoring";
import Temperature from "./pages/Temperature";
import Humidity from "./pages/Humidity";
import AirQuality from "./pages/AirQuality";
import Alerts from "./pages/Alerts";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/light">Light</Link>
        <Link to="/temperature">Temperature</Link>
        <Link to="/humidity">Humidity</Link>
        <Link to="/air-quality">Air Quality</Link>
        <Link to="/alerts">Alerts</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/light" element={<LightMonitoring />} />
        <Route path="/temperature" element={<Temperature />} />
        <Route path="/humidity" element={<Humidity />} />
        <Route path="/air-quality" element={<AirQuality />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </BrowserRouter>
  );
}