import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

import DashboardShell from "../components/dashboard/DashboardShell";
import DashboardMainGrid from "../components/dashboard/DashboardMainGrid";
import MetricPill from "../components/dashboard/MetricPill";
import MetricPills from "../components/dashboard/MetricPills";
import FeaturedAnalyticsCard from "../components/dashboard/FeaturedAnalyticsCard";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function DashboardPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function fetchProjects(currentToken) {
    try {
      const res = await fetch(`${API_BASE}/api/projects`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch projects");

      const data = await res.json();
      setProjects(data);

      if (data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(String(data[0].id));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load projects.");
    }
  }

  async function fetchDashboardData(projectId, currentToken) {
    if (!projectId || !currentToken) return;

    setLoading(true);
    setError("");

    try {
      const [dashboardRes, heatmapRes] = await Promise.all([
        fetch(`${API_BASE}/api/dashboard/${projectId}`, {
          headers: { Authorization: `Bearer ${currentToken}` },
        }),
        fetch(`${API_BASE}/api/dashboard/${projectId}/heatmap`, {
          headers: { Authorization: `Bearer ${currentToken}` },
        }),
      ]);

      if (!dashboardRes.ok) throw new Error("Failed to fetch dashboard");
      if (!heatmapRes.ok) throw new Error("Failed to fetch heatmap");

      const dashboardData = await dashboardRes.json();
      const heatmapData = await heatmapRes.json();

      setDashboard(dashboardData);
      setHeatmap(heatmapData);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) fetchProjects(token);
  }, [token]);

  useEffect(() => {
    if (token && selectedProjectId) {
      fetchDashboardData(selectedProjectId, token);
    }
  }, [token, selectedProjectId]);

  return (
    <DashboardShell
      sidebar={
        <>
          <div className="brand-badge">B</div>
          <h2 className="brand-title">Bloxscope</h2>
          <p className="brand-subtitle">Roblox Analytics SaaS</p>

          <nav className="sidebar-nav">
            <button
              className="sidebar-nav-btn sidebar-nav-btn-active"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="sidebar-nav-btn"
              onClick={() => navigate("/projects")}
            >
              Projects
            </button>
            <button
              className="sidebar-nav-btn"
              onClick={() => navigate("/billing")}
            >
              Billing
            </button>
          </nav>

          <div className="sidebar-actions">
            <button className="sidebar-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      }
      header={
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Project analytics overview</p>
        </div>
      }
    >
      {error && <div className="error-box">{error}</div>}

      {dashboard && (
        <MetricPills>
          <MetricPill
            label="CCU"
            value={dashboard.activeSessions}
            color="green"
          />
          <MetricPill
            label="Avg Session"
            value="--"
            sub="(soon)"
            color="yellow"
          />
          <MetricPill
            label="Total Sessions"
            value={dashboard.totalSessions}
            color="blue"
          />
          <MetricPill
            label="Events"
            value={dashboard.totalEvents}
            color="purple"
          />
        </MetricPills>
      )}

      {loading && <div className="panel">Loading dashboard...</div>}

      <DashboardMainGrid
        left={
          <>
            <FeaturedAnalyticsCard
              subtitle="Retention"
              title="Day 1 Retention"
              statLabel="Current"
              statValue="--"
              description="This area will become the main analytics surface for session-based retention, player drop-off, and anomaly detection once event tracking is connected."
              actions={[
                { label: "Check Session Flow", onClick: () => {} },
                { label: "Review Funnel", onClick: () => {} },
                { label: "Ignore Alert", onClick: () => {} },
              ]}
            />

            <section className="panel analytics-panel">
              <div className="panel-header">
                <h2>Heatmap Preview</h2>
                <span>{heatmap.length} cells</span>
              </div>

              <div className="table-wrapper">
                <table className="heatmap-table">
                  <thead>
                    <tr>
                      <th>Cell X</th>
                      <th>Cell Z</th>
                      <th>Hit Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heatmap.length > 0 ? (
                      heatmap.slice(0, 8).map((cell, index) => (
                        <tr key={index}>
                          <td>{cell.cellX}</td>
                          <td>{cell.cellZ}</td>
                          <td>{cell.hitCount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No heatmap data yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        }
        right={
          <>
            <section className="panel analytics-panel">
              <div className="panel-header">
                <h2>Alert Stack</h2>
              </div>

              <div className="alert-stack">
                <div className="alert-card alert-card-red">
                  <div className="alert-card-title">Retention anomaly detected</div>
                  <div className="alert-card-text">
                    Session retention signals dropped after the latest gameplay update.
                  </div>
                  <button className="alert-card-btn">View Alert</button>
                </div>

                <div className="alert-card alert-card-yellow">
                  <div className="alert-card-title">Session metric pending</div>
                  <div className="alert-card-text">
                    Average session length will unlock after event ingestion is active.
                  </div>
                  <button className="alert-card-btn">View Details</button>
                </div>

                <div className="alert-card alert-card-green">
                  <div className="alert-card-title">System ready</div>
                  <div className="alert-card-text">
                    Dashboard layout is ready for custom Roblox analytics ingestion.
                  </div>
                  <button className="alert-card-btn">Continue Build</button>
                </div>
              </div>
            </section>

            <section className="panel analytics-panel">
              <div className="panel-header">
                <h2>Insights</h2>
              </div>

              <div className="stat-card analytics-placeholder">
                <p>
                  Automated gameplay insights, funnel issues, and actionable developer
                  recommendations will appear here later.
                </p>
              </div>
            </section>
          </>
        }
      />
    </DashboardShell>
  );
}