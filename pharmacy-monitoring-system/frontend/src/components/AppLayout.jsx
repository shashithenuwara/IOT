import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/",            label: "Overview",    icon: <GridIcon /> },
  { to: "/temperature", label: "Temperature", icon: <TempIcon /> },
  { to: "/humidity",    label: "Humidity",    icon: <HumIcon /> },
  { to: "/light",       label: "Light",       icon: <LightIcon /> },
  { to: "/air-quality", label: "Air Quality", icon: <AirIcon /> },
  { to: "/alerts",      label: "Alerts",      icon: <AlertIcon /> },
];

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}
function TempIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 9.5V3.5M8 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="8" cy="12" r="1" fill="currentColor"/>
    </svg>
  );
}
function HumIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L4 8a4 4 0 008 0L8 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  );
}
function LightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.42 1.42M11.36 11.36l1.42 1.42M3.22 12.78l1.42-1.42M11.36 4.64l1.42-1.42" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function AirIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 5h8a2 2 0 000-4 2 2 0 00-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M2 8h10a2 2 0 000-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M2 11h6a2 2 0 010 4 2 2 0 01-2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1L1 14h14L8 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M8 6v4M8 11.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

export default function AppLayout({ children }) {
  const location = useLocation();

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px",
        minHeight: "100vh",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "28px", height: "28px",
              background: "var(--accent-dim)",
              border: "1px solid rgba(78,184,255,0.25)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v3M7 10v3M1 7h3M10 7h3" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="7" cy="7" r="2.5" stroke="var(--accent)" strokeWidth="1.4"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-primary)", letterSpacing: "0.5px", lineHeight: 1.1 }}>MEDISTORE</div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.3px", marginTop: "1px" }}>Monitor</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1 }}>
          <div style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "1px", padding: "8px 10px 6px", fontWeight: "600" }}>SENSORS</div>
          {NAV_ITEMS.map(({ to, label, icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                  color: active ? "var(--accent)" : "var(--text-secondary)",
                  background: active ? "var(--accent-dim)" : "transparent",
                  fontWeight: active ? "600" : "400",
                  fontSize: "13.5px",
                  transition: "all 0.15s ease",
                  marginBottom: "2px",
                  border: active ? "1px solid rgba(78,184,255,0.15)" : "1px solid transparent",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}}
              >
                <span style={{ opacity: active ? 1 : 0.7, flexShrink: 0 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--border)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <div style={{
              width: "6px", height: "6px",
              background: "var(--safe)",
              borderRadius: "50%",
              boxShadow: "0 0 6px var(--safe)",
            }}/>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Live data feed</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        marginLeft: "220px",
        flex: 1,
        minHeight: "100vh",
        background: "var(--bg-base)",
        overflowX: "hidden",
      }}>
        {children}
      </main>
    </div>
  );
}
