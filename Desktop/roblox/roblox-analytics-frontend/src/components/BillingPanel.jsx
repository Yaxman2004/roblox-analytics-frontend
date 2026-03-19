import { useEffect, useState } from "react";
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
    <div className="billing-layout">
      <section className="panel">
        <div className="panel-header">
          <h2>Current Subscription</h2>
        </div>

        <div className="billing-current-card">
          <div className="billing-current-top">
            <div>
              <div className="billing-eyebrow">Active Plan</div>
              <div className="billing-current-plan">
                {billing?.planTier || "Loading..."}
              </div>
            </div>

            <div className="billing-status-wrap">
              <div className="billing-eyebrow">Status</div>
              <div className="billing-status-pill">
                {billing?.subscriptionStatus || "Loading..."}
              </div>
            </div>
          </div>

          <div className="billing-current-actions">
            {billing && (
              <button
                onClick={openBillingPortal}
                className="billing-primary-btn"
              >
                Manage Billing
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Choose a Plan</h2>
        </div>

        <div className="billing-plans-grid">
          <div className="billing-plan-card">
            <div className="billing-plan-name">Starter</div>
            <div className="billing-plan-price">
              $4.99<span>/mo</span>
            </div>
            <div className="billing-plan-desc">
              Basic analytics for getting started.
            </div>

            <ul className="billing-feature-list">
              <li>Core dashboard access</li>
              <li>Project analytics overview</li>
              <li>Starter reporting</li>
            </ul>

            <button
              onClick={() => upgrade("STARTER")}
              disabled={loading === "STARTER"}
              className="billing-plan-btn"
            >
              {loading === "STARTER" ? "Loading..." : "Choose Starter"}
            </button>
          </div>

          <div className="billing-plan-card billing-plan-card-featured">
            <div className="billing-plan-badge">Most Popular</div>
            <div className="billing-plan-name">Pro</div>
            <div className="billing-plan-price">
              $11.99<span>/mo</span>
            </div>
            <div className="billing-plan-desc">
              Advanced analytics for growing Roblox games.
            </div>

            <ul className="billing-feature-list">
              <li>Advanced analytics</li>
              <li>Better visibility into retention</li>
              <li>Built for active development</li>
            </ul>

            <button
              onClick={() => upgrade("PRO")}
              disabled={loading === "PRO"}
              className="billing-plan-btn billing-plan-btn-featured"
            >
              {loading === "PRO" ? "Loading..." : "Choose Pro"}
            </button>
          </div>

          <div className="billing-plan-card">
            <div className="billing-plan-name">Scale</div>
            <div className="billing-plan-price">
              $24.99<span>/mo</span>
            </div>
            <div className="billing-plan-desc">
              For larger games and teams that want room to grow.
            </div>

            <ul className="billing-feature-list">
              <li>Highest tier access</li>
              <li>Built for scaling analytics</li>
              <li>Best for long-term growth</li>
            </ul>

            <button
              onClick={() => upgrade("SCALE")}
              disabled={loading === "SCALE"}
              className="billing-plan-btn"
            >
              {loading === "SCALE" ? "Loading..." : "Choose Scale"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}