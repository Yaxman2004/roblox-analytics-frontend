import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import RobloxConnectCard from "../components/RobloxConnectCard";
import BillingPanel from "../components/BillingPanel";

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
  const [successMessage, setSuccessMessage] = useState("");

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    gameId: "",
  });

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

function refreshProjects() {
  fetchProjects(token);
}

  const selectedProject = projects.find(
    (project) => String(project.id) === String(selectedProjectId)
  );

  async function fetchProjects(currentToken) {
    try {
      const res = await fetch(`${API_BASE}/api/projects`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }

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
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }),
        fetch(`${API_BASE}/api/dashboard/${projectId}/heatmap`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }),
      ]);

      if (!dashboardRes.ok) {
        throw new Error("Failed to fetch dashboard");
      }

      if (!heatmapRes.ok) {
        throw new Error("Failed to fetch heatmap");
      }

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

  async function handleCreateProject(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectForm),
      });

      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      await fetchProjects(token);

      setProjectForm({
        name: "",
        description: "",
        gameId: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to create project.");
    }
  }

  useEffect(() => {
    if (token) {
      fetchProjects(token);
    }
  }, [token]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const projectId = params.get("projectId");
    const roblox = params.get("roblox");

    if (projectId) {
      setSelectedProjectId(projectId);
    }

    if (roblox === "connected") {
      setSuccessMessage("Roblox account connected successfully!");
    }

    if (roblox === "error") {
      setError("Failed to connect Roblox account.");
    }

    if (projectId || roblox) {
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

  useEffect(() => {
    if (token && selectedProjectId) {
      fetchDashboardData(selectedProjectId, token);
    }
  }, [token, selectedProjectId]);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">RA</div>
        <h2>Roblox Analytics</h2>
        <p className="sidebar-subtext">Micro SaaS Dashboard</p>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Project analytics overview</p>
          </div>
        </header>

        {error && <div className="error-box">{error}</div>}
        {successMessage && <div className="success-box">{successMessage}</div>}

        <section className="panel">
          <div className="panel-header">
            <h2>Your Projects</h2>
          </div>

          <div className="form-grid">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {selectedProject && (
          <section className="panel">
            <div className="panel-header">
              <h2>Linked Roblox Game</h2>
            </div>

            <div className="stat-card">
              <p><strong>Project Name:</strong> {selectedProject.name}</p>
              <p><strong>Universe ID:</strong> {selectedProject.robloxUniverseId || "Not linked yet"}</p>
              <p><strong>Place ID:</strong> {selectedProject.robloxPlaceId || "Not linked yet"}</p>
              <p><strong>Legacy Game ID:</strong> {selectedProject.gameId || "Not set"}</p>
            </div>
          </section>
        )}

        <section className="panel">
          <div className="panel-header">
            <h2>Create Project</h2>
          </div>

          <form onSubmit={handleCreateProject} className="form-grid">
            <input
              type="text"
              placeholder="Project Name"
              value={projectForm.name}
              onChange={(e) =>
                setProjectForm({ ...projectForm, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              value={projectForm.description}
              onChange={(e) =>
                setProjectForm({
                  ...projectForm,
                  description: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Game ID"
              value={projectForm.gameId}
              onChange={(e) =>
                setProjectForm({ ...projectForm, gameId: e.target.value })
              }
            />
            <button type="submit">Create Project</button>
          </form>
        </section>

        <BillingPanel />

        {selectedProjectId && (
          <RobloxConnectCard
            projectId={selectedProjectId}
            onImportSuccess={refreshProjects}
          />
        )}

        {loading && <div className="panel">Loading dashboard...</div>}

        {dashboard && (
          <section className="stats-grid">
            <div className="stat-card">
              <h3>Total Events</h3>
              <p>{dashboard.totalEvents}</p>
            </div>

            <div className="stat-card">
              <h3>Total Sessions</h3>
              <p>{dashboard.totalSessions}</p>
            </div>

            <div className="stat-card">
              <h3>Active Sessions</h3>
              <p>{dashboard.activeSessions}</p>
            </div>
          </section>
        )}

        <section className="panel">
          <div className="panel-header">
            <h2>Heatmap Cells</h2>
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
                {heatmap.map((cell, index) => (
                  <tr key={index}>
                    <td>{cell.cellX}</td>
                    <td>{cell.cellZ}</td>
                    <td>{cell.hitCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}