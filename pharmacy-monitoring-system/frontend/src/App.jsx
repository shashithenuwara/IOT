import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Temperature from "./pages/Temperature";
import Humidity from "./pages/Humidity";
import Light from "./pages/Light";
import AirQuality from "./pages/AirQuality";
import Alerts from "./pages/Alerts";

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/"            element={<Dashboard />} />
          <Route path="/temperature" element={<Temperature />} />
          <Route path="/humidity"    element={<Humidity />} />
          <Route path="/light"       element={<Light />} />
          <Route path="/air-quality" element={<AirQuality />} />
          <Route path="/alerts"      element={<Alerts />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
