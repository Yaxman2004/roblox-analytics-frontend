import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

export default function RobloxConnectCard({ projectId, onImportSuccess }) {
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [savingImport, setSavingImport] = useState(false);
  const [loadingGames, setLoadingGames] = useState(false);

  const [status, setStatus] = useState({
    connected: false,
    robloxUserId: null,
    username: null,
    displayName: null,
    avatarUrl: null
  });

  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState("");

  const [importForm, setImportForm] = useState({
    robloxUniverseId: "",
    robloxPlaceId: "",
    name: ""
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function loadStatus() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await apiFetch(`/api/roblox/connect/status?projectId=${projectId}`);
      setStatus(data);
    } catch (err) {
      setError(err.message || "Failed to load Roblox connection");
    } finally {
      setLoading(false);
    }
  }

  async function loadGames() {
    try {
      setLoadingGames(true);
      const data = await apiFetch(`/api/roblox/games/${projectId}`);
      setGames(data || []);

      if (data && data.length > 0) {
        setSelectedGameId(String(data[0].universeId));
      } else {
        setSelectedGameId("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGames(false);
    }
  }

  async function connectRoblox() {
    try {
      setConnecting(true);
      setError("");
      setSuccess("");

      const data = await apiFetch(`/api/roblox/connect/start?projectId=${projectId}`, {
        method: "POST"
      });

      window.location.href = data.authorizeUrl;
    } catch (err) {
      setError(err.message || "Failed to start Roblox connection");
      setConnecting(false);
    }
  }

  async function disconnectRoblox() {
    try {
      setDisconnecting(true);
      setError("");
      setSuccess("");

      await apiFetch(`/api/roblox/connect?projectId=${projectId}`, {
        method: "DELETE"
      });

      setStatus({
        connected: false,
        robloxUserId: null,
        username: null,
        displayName: null,
        avatarUrl: null
      });

      setGames([]);
      setSelectedGameId("");
      setSuccess("Roblox account unlinked.");
    } catch (err) {
      setError(err.message || "Failed to disconnect Roblox account");
    } finally {
      setDisconnecting(false);
    }
  }

  async function importSelectedGame() {
    try {
      if (!selectedGameId) {
        setError("Please select a Roblox game first.");
        return;
      }

      const selectedGame = games.find(
        (game) => String(game.universeId) === String(selectedGameId)
      );

      if (!selectedGame) {
        setError("Selected game could not be found.");
        return;
      }

      setSavingImport(true);
      setError("");
      setSuccess("");

      await apiFetch(`/api/projects/${projectId}/roblox-import`, {
        method: "POST",
        body: JSON.stringify({
          robloxUniverseId: selectedGame.universeId,
          robloxPlaceId: selectedGame.rootPlaceId || "",
          name: selectedGame.name || `Game ${selectedGame.universeId}`
        })
      });

      setSuccess("Selected Roblox game imported successfully.");
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (err) {
      setError(err.message || "Failed to import selected Roblox game");
    } finally {
      setSavingImport(false);
    }
  }

  async function saveManualImport(e) {
    e.preventDefault();

    try {
      setSavingImport(true);
      setError("");
      setSuccess("");

      await apiFetch(`/api/projects/${projectId}/roblox-import`, {
        method: "POST",
        body: JSON.stringify(importForm)
      });

      setSuccess("Roblox game imported successfully.");
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (err) {
      setError(err.message || "Failed to import Roblox game");
    } finally {
      setSavingImport(false);
    }
  }

  useEffect(() => {
    if (projectId) {
      loadStatus();
    }
  }, [projectId]);

  useEffect(() => {
    if (status.connected && projectId) {
      loadGames();
    }
  }, [status.connected, projectId]);

  if (loading) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h2>Roblox Connection</h2>
        </div>
        <div className="stat-card">
          <p>Loading Roblox connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Roblox Connection</h2>
      </div>

      {status.connected ? (
        <div className="stat-card" style={{ marginBottom: "20px" }}>
          <p><strong>Status:</strong> Connected ✅</p>
          <p><strong>Username:</strong> {status.username || "Unknown"}</p>
          <p><strong>Display Name:</strong> {status.displayName || "Unknown"}</p>
          <p><strong>Roblox User ID:</strong> {status.robloxUserId || "Unknown"}</p>

          {status.avatarUrl && (
            <img
              src={status.avatarUrl}
              alt="avatar"
              style={{ width: 60, borderRadius: "50%", marginTop: 10, marginBottom: 10 }}
            />
          )}

          <button onClick={disconnectRoblox} disabled={disconnecting}>
            {disconnecting ? "Disconnecting..." : "Unlink Roblox Account"}
          </button>
        </div>
      ) : (
        <div className="stat-card" style={{ marginBottom: "20px" }}>
          <p>Not connected</p>

          <button onClick={connectRoblox} disabled={connecting}>
            {connecting ? "Redirecting..." : "Connect Roblox Account"}
          </button>
        </div>
      )}

      {status.connected && (
        <>
          <div className="panel-header">
            <h2>Auto Import Roblox Game</h2>
          </div>

          <div className="stat-card" style={{ marginBottom: "20px" }}>
            {loadingGames ? (
              <p>Loading Roblox games...</p>
            ) : games.length > 0 ? (
              <>
                <select
                  value={selectedGameId}
                  onChange={(e) => setSelectedGameId(e.target.value)}
                  style={{ marginBottom: "10px" }}
                >
                  {games.map((game) => (
                    <option key={game.universeId} value={game.universeId}>
                      {game.name || `Game ${game.universeId}`} ({game.ownerType || "UNKNOWN"})
                    </option>
                  ))}
                </select>

                <button onClick={importSelectedGame} disabled={savingImport}>
                  {savingImport ? "Importing..." : "Import Selected Roblox Game"}
                </button>
              </>
            ) : (
              <p>No Roblox games were auto-found. Use manual import below.</p>
            )}
          </div>
        </>
      )}

      <div className="panel-header">
        <h2>Manual Roblox Game Import</h2>
      </div>

      <form onSubmit={saveManualImport} className="form-grid">
        <input
          type="text"
          placeholder="Roblox Universe ID"
          value={importForm.robloxUniverseId}
          onChange={(e) =>
            setImportForm({
              ...importForm,
              robloxUniverseId: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Roblox Place ID"
          value={importForm.robloxPlaceId}
          onChange={(e) =>
            setImportForm({
              ...importForm,
              robloxPlaceId: e.target.value
            })
          }
        />

        <input
          type="text"
          placeholder="Game Name (optional)"
          value={importForm.name}
          onChange={(e) =>
            setImportForm({
              ...importForm,
              name: e.target.value
            })
          }
        />

        <button type="submit" disabled={savingImport}>
          {savingImport ? "Saving..." : "Import Roblox Game"}
        </button>
      </form>

      {success && <p style={{ color: "#22c55e", marginTop: "10px" }}>{success}</p>}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}