import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
const navigate=useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      localStorage.setItem("id",data.userId);
      localStorage.removeItem("token")
      localStorage.setItem("token",data.token);
      
      setSuccessMessage(data.message || "Login successful!");
      // Optionally store token: localStorage.setItem("token", data.token);

      navigate('/home')
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

        {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setError("")}></button>
        </div>}

        {successMessage && <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setSuccessMessage("")}></button>
        </div>}

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
              <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Logging in...</>
            ) : "Login"}
          </button>
        </form>

        <div className="mt-3 text-center">
          <small className="text-muted">Don't have an account? <a href="/register" className="text-decoration-none">Register here</a></small>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
