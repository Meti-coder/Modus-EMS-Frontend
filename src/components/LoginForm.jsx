import React, { useState, useEffect } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Redirect to /home if already logged in
  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp > now) {
          navigate("/home");
        } else {
          // Token expired
          localStorage.removeItem("token");
          Cookies.remove("token");
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        Cookies.remove("token");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email || !password) {
      setError("Enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);

      console.log("Login success:", data);

      // Optional: store token in localStorage if not using HttpOnly cookies
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      localStorage.setItem("id", data.userId);
      setSuccessMessage(data.message || "Login successful!");
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: '420px', width: '100%' }}>
        <h2 className="card-title text-center mb-4 text-primary">Login</h2>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setError("")}></button>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {successMessage}
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setSuccessMessage("")}></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : "Login"}
          </button>
        </form>

        <div className="mt-3 text-center">
          <small className="text-muted">
            Don't have an account? <a href="/register" className="text-decoration-none">Register here</a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
