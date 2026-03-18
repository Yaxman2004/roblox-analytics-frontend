import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";

export default function BillingPanel() {
  const [loading, setLoading] = useState("");
  const [billing, setBilling] = useState(null);

  async function fetchBillingStatus() {
    try {
      const data = await apiFetch("/api/billing/status");
      setBilling(data);
    } catch (err) {
      console.error("Failed to load billing status", err);
    }
  }

  useEffect(() => {
    fetchBillingStatus();
  }, []);

  async function upgrade(plan) {
    try {
      setLoading(plan);

      const response = await apiFetch("/api/billing/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({
          planTier: plan,
        }),
      });

      window.location.href = response.url;
    } catch (err) {
      alert(err.message || "Failed to start checkout");
      setLoading("");
    }
  }

  async function openBillingPortal() {
    try {
      const res = await apiFetch("/api/billing/portal", {
        method: "POST",
      });

      window.location.href = res.url;
    } catch (err) {
      alert("Failed to open billing portal");
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Billing</h2>
      </div>

      <div className="stat-card" style={{ marginBottom: "20px" }}>
        <h3>Current Subscription</h3>
        <p><strong>Plan:</strong> {billing?.planTier || "Loading..."}</p>
        <p><strong>Status:</strong> {billing?.subscriptionStatus || "Loading..."}</p>

        {billing && (
          <button onClick={openBillingPortal} style={{ marginTop: "10px" }}>
            Manage Billing
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div className="stat-card">
          <h3>Starter</h3>
          <p>Basic analytics</p>
          <button
            onClick={() => upgrade("STARTER")}
            disabled={loading === "STARTER"}
          >
            {loading === "STARTER" ? "Loading..." : "Upgrade"}
          </button>
        </div>

        <div className="stat-card">
          <h3>Pro</h3>
          <p>Advanced analytics</p>
          <button
            onClick={() => upgrade("PRO")}
            disabled={loading === "PRO"}
          >
            {loading === "PRO" ? "Loading..." : "Upgrade"}
          </button>
        </div>

        <div className="stat-card">
          <h3>Scale</h3>
          <p>Unlimited scale</p>
          <button
            onClick={() => upgrade("SCALE")}
            disabled={loading === "SCALE"}
          >
            {loading === "SCALE" ? "Loading..." : "Upgrade"}
          </button>
        </div>
      </div>
    </div>
  );
}