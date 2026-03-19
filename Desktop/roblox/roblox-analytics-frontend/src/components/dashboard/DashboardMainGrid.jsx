export default function DashboardMainGrid({ left, right }) {
  return (
    <div className="dashboard-main-grid">
      <div className="dashboard-main-grid-left">
        {left}
      </div>

      <div className="dashboard-main-grid-right">
        {right}
      </div>
    </div>
  );
}