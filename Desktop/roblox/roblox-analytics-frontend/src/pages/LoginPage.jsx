import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loginForm, setLoginForm] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Login failed. Check your username/email and password.");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerForm),
      });

      if (!res.ok) {
        throw new Error("Register failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Signup failed. Try a different email or username.");
    }
  }

  return (
    <div className="app">
      <main className="main-content centered">
        <section className="panel auth-panel">
          <h1>Roblox Analytics</h1>
          <p>{mode === "login" ? "Sign in to your account." : "Create your account."}</p>

          {error && <div className="error-box">{error}</div>}
          {successMessage && <div className="success-box">{successMessage}</div>}

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="form-grid">
              <input
                type="text"
                placeholder="Email or Username"
                value={loginForm.emailOrUsername}
                onChange={(e) =>
                  setLoginForm({
                    ...loginForm,
                    emailOrUsername: e.target.value,
                  })
                }
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({
                    ...loginForm,
                    password: e.target.value,
                  })
                }
              />
              <button type="submit">Login</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="form-grid">
              <input
                type="text"
                placeholder="Username"
                value={registerForm.username}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    username: e.target.value,
                  })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    email: e.target.value,
                  })
                }
              />
              <input
                type="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    password: e.target.value,
                  })
                }
              />
              <button type="submit">Sign Up</button>
            </form>
          )}

          <button
            className="toggle-auth-btn"
            onClick={() => {
              setError("");
              setMode(mode === "login" ? "register" : "login");
            }}
          >
            {mode === "login"
              ? "Need an account? Sign up"
              : "Already have an account? Login"}
          </button>
        </section>
      </main>
    </div>
  );
}