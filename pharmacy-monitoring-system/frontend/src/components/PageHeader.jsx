export default function PageHeader({ title, subtitle, badge, children }) {
  return (
    <div style={{
      padding: "32px 36px 24px",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: "16px",
    }}>
      <div>
        {badge && (
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "10px",
            fontWeight: "600",
            letterSpacing: "1.2px",
            color: "var(--text-accent)",
            marginBottom: "8px",
            textTransform: "uppercase",
          }}>
            <div style={{
              width: "5px", height: "5px",
              borderRadius: "50%",
              background: "var(--accent)",
              boxShadow: "0 0 6px var(--accent)",
            }}/>
            {badge}
          </div>
        )}
        <h1 style={{ fontSize: "24px", fontWeight: "700", margin: 0, color: "var(--text-primary)" }}>{title}</h1>
        {subtitle && (
          <p style={{ marginTop: "6px", color: "var(--text-secondary)", fontSize: "13.5px" }}>{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
