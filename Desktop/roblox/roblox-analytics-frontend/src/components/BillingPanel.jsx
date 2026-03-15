import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function BillingPanel() {

  const [loading, setLoading] = useState("");

  async function upgrade(plan) {
    try {

      setLoading(plan);

      const response = await apiFetch("/api/billing/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({
          planTier: plan
        })
      });

      window.location.href = response.url;

    } catch (err) {
      alert(err.message || "Failed to start checkout");
      setLoading("");
    }
  }

  return (
    <div className="panel">

      <div className="panel-header">
        <h2>Billing</h2>
      </div>

      <div style={{display:"flex",gap:"20px",flexWrap:"wrap"}}>

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