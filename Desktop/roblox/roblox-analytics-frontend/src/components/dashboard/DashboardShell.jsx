export default function DashboardShell({ sidebar, header, children }) {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        {sidebar}
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-inner">
          {header && <div className="dashboard-header">{header}</div>}
          <div className="dashboard-content">{children}</div>
        </div>
      </main>
    </div>
  );
}