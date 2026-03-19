import { useNavigate } from "react-router-dom";
import "../App.css";

import BillingPanel from "../components/BillingPanel";
import DashboardShell from "../components/dashboard/DashboardShell";

export default function BillingPage() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <DashboardShell
      sidebar={
        <>
          <div className="brand-badge">B</div>
          <h2 className="brand-title">Bloxscope</h2>
          <p className="brand-subtitle">Roblox Analytics SaaS</p>

          <nav className="sidebar-nav">
            <button
              className="sidebar-nav-btn"
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
              className="sidebar-nav-btn sidebar-nav-btn-active"
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
          <h1 className="dashboard-title">Billing</h1>
          <p className="dashboard-subtitle">
            Manage your subscription and billing portal
          </p>
        </div>
      }
    >
      <BillingPanel />
    </DashboardShell>
  );
}