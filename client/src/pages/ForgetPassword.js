// src/pages/ForgetPassword.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config/config";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post(`${serverEndpoint}/auth/send-reset-password-token`, { email });
      setMessage("Reset code sent to your email.");
      setError("");
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      setError(backendMessage || "Failed to send reset code. Try again.");
    }
  };

  return (
    <section style={{ background: 'var(--background)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: '2.5rem 2rem', margin: '0 auto' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '2rem', marginBottom: 24, textAlign: 'center' }}>Forgot Password</h2>
          {message && <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: '8px', padding: '1em', marginBottom: '1.5em', fontWeight: 500, border: '1px solid #6ee7b7', textAlign: 'center' }}>{message}</div>}
          {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '1em', marginBottom: '1.5em', fontWeight: 500, border: '1px solid #fecaca', textAlign: 'center' }}>{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 22 }}>
              <label htmlFor="email" style={{ display: 'block', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                name="email"
                style={{ width: '100%', padding: '0.7em 1em', borderRadius: 'var(--radius)', border: error ? '1.5px solid #ef4444' : '1.5px solid var(--border)', fontSize: '1rem', background: '#fff', color: 'var(--text)' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <button type="submit" className="cta-btn" style={{ width: '100%' }} disabled={!email}>
              Send Reset Code
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ForgetPassword;
