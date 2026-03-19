export default function FeaturedAnalyticsCard({
  title,
  subtitle,
  statLabel,
  statValue,
  description,
  actions = [],
}) {
  return (
    <section className="panel featured-analytics-card">
      <div className="featured-analytics-top">
        <div>
          <div className="featured-analytics-eyebrow">{subtitle}</div>
          <h2 className="featured-analytics-title">{title}</h2>
        </div>

        <div className="featured-analytics-stat">
          <span className="featured-analytics-stat-label">{statLabel}</span>
          <span className="featured-analytics-stat-value">{statValue}</span>
        </div>
      </div>

      <div className="featured-analytics-chart-placeholder">
        <div className="featured-line">
          <div className="featured-line-dot"></div>
        </div>
      </div>

      <div className="featured-analytics-summary">
        <h3>Analytics Summary</h3>
        <p>{description}</p>
      </div>

      {actions.length > 0 && (
        <div className="featured-analytics-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              type="button"
              className="featured-action-btn"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}