import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

import RobloxConnectCard from "../components/RobloxConnectCard";
import DashboardShell from "../components/dashboard/DashboardShell";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ProjectsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [error, setError] = useState("");
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

      if (!res.ok) throw new Error("Failed to create project");

      await fetchProjects(token);

      setProjectForm({
        name: "",
        description: "",
        gameId: "",
      });

      setSuccessMessage("Project created successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to create project.");
    }
  }

  useEffect(() => {
    if (token) fetchProjects(token);
  }, [token]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const projectId = params.get("projectId");
    const roblox = params.get("roblox");

    if (projectId) setSelectedProjectId(projectId);

    if (roblox === "connected") {
      setSuccessMessage("Roblox account connected successfully!");
    }

    if (roblox === "error") {
      setError("Failed to connect Roblox account.");
    }

    if (projectId || roblox) {
      window.history.replaceState({}, document.title, "/projects");
    }
  }, []);

  return (
    <DashboardShell
      sidebar={
        <>
          <div className="brand-badge">B</div>
          <h2 className="brand-title">Bloxscope</h2>
          <p className="brand-subtitle">Live Roblox Statistics</p>

          <nav className="sidebar-nav">
            <button
              className="sidebar-nav-btn"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="sidebar-nav-btn sidebar-nav-btn-active"
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
          <h1 className="dashboard-title">Projects</h1>
          <p className="dashboard-subtitle">
            Manage projects, Roblox linking, imports, and setup
          </p>
        </div>
      }
    >
      {error && <div className="error-box">{error}</div>}
      {successMessage && <div className="success-box">{successMessage}</div>}

      <div className="page-grid-2">
        <div className="page-grid-2-left">
          <section className="panel">
            <div className="panel-header">
              <h2>Your Projects</h2>
            </div>

            <div className="projects-inline-actions">
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

          {selectedProjectId && (
            <RobloxConnectCard
              projectId={selectedProjectId}
              onImportSuccess={refreshProjects}
              variant="imports"
            />
          )}
        </div>

        <div className="page-grid-2-right">
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

          {selectedProjectId && (
            <RobloxConnectCard
              projectId={selectedProjectId}
              onImportSuccess={refreshProjects}
              variant="connection"
            />
          )}
        </div>
      </div>
    </DashboardShell>
  );
}