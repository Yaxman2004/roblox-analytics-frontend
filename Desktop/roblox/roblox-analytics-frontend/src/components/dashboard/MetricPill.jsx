export default function MetricPill({ label, value, color, sub }) {
  return (
    <div className={`metric-pill metric-pill-${color}`}>
      <div className="metric-pill-label">{label}</div>
      <div className="metric-pill-value">
        {value} {sub && <span className="metric-pill-sub">{sub}</span>}
      </div>
    </div>
  );
}