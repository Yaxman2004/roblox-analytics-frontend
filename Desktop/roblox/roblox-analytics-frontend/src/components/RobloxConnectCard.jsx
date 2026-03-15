import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function RobloxConnectCard({ projectId }) {

  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [status, setStatus] = useState({
    connected: false,
    robloxUserId: null,
    username: null,
    displayName: null,
    avatarUrl: null
  });

  const [error, setError] = useState("");

  async function loadStatus() {
    try {
      setLoading(true);

      const data = await apiFetch(`/api/roblox/connect/status?projectId=${projectId}`);

      setStatus(data);

    } catch (err) {
      setError("Failed to load Roblox connection");
    } finally {
      setLoading(false);
    }
  }

  async function connectRoblox() {

    try {

      setConnecting(true);

      const data = await apiFetch(`/api/roblox/connect/start?projectId=${projectId}`, {
        method: "POST"
      });

      window.location.href = data.authorizeUrl;

    } catch (err) {

      setError("Failed to start Roblox connection");
      setConnecting(false);

    }

  }

  useEffect(() => {

    if (projectId) {
      loadStatus();
    }

  }, [projectId]);

  if (loading) {
    return <div>Loading Roblox connection...</div>;
  }

  return (
    <div style={{
      background: "#111827",
      borderRadius: "12px",
      padding: "20px",
      marginTop: "20px"
    }}>

      <h3 style={{ marginBottom: "10px" }}>
        Roblox Account
      </h3>

      {!status.connected && (

        <>
          <p style={{ color: "#9CA3AF" }}>
            Connect your Roblox account to this project.
          </p>

          <button
            onClick={connectRoblox}
            disabled={connecting}
            style={{
              background: "#2563EB",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            {connecting ? "Redirecting..." : "Connect Roblox Account"}
          </button>
        </>

      )}

      {status.connected && (

        <div>

          <p style={{ color: "#22C55E", fontWeight: "bold" }}>
            Roblox Account Connected
          </p>

          <p>
            {status.displayName} (@{status.username})
          </p>

          {status.avatarUrl && (
            <img
              src={status.avatarUrl}
              alt="avatar"
              style={{ width: "60px", borderRadius: "50%" }}
            />
          )}

        </div>

      )}

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

    </div>
  );
}