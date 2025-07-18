import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions";
import axios from "axios";
import { serverEndpoint } from "../config/config";

function Register() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: ""
  });

  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is mandatory";
    if (!formData.username) newErrors.username = "Username is mandatory";
    if (!formData.password) newErrors.password = "Password is mandatory";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(`${serverEndpoint}/auth/register`, formData, {
        withCredentials: true
      });
      dispatch({
        type: SET_USER,
        payload: response.data.user
      });
    } catch (error) {
      if (error?.response?.status === 401) {
        setErrors({ message: "User already exists with this email" });
      } else {
        setErrors({ message: "Something went wrong, please try again" });
      }
    }

    setValidated(true);
  };

  const handleGoogleSignin = async (authResponse) => {
    try {
      const response = await axios.post(`${serverEndpoint}/auth/google-auth`, {
        idToken: authResponse.credential
      }, { withCredentials: true });

      dispatch({
        type: SET_USER,
        payload: response.data.userDetails
      });
    } catch (error) {
      setErrors({ message: 'Something went wrong during Google sign-in' });
    }
  };

  return (
    <section style={{ background: 'var(--background)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: 440, width: '100%' }}>
        <div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: '2.5rem 2rem', margin: '0 auto' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '2rem', marginBottom: 24, textAlign: 'center' }}>Create a New Account</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: 28, fontSize: '1rem' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Login</a>
          </p>

          {errors.message && (
            <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '1em', marginBottom: '1.5em', fontWeight: 500, border: '1px solid #fecaca', textAlign: 'center' }}>{errors.message}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="name" style={{ display: 'block', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: 6 }}>Name</label>
              <input
                type="text"
                name="name"
                style={{ width: '100%', padding: '0.7em 1em', borderRadius: 'var(--radius)', border: errors.name ? '1.5px solid #ef4444' : '1.5px solid var(--border)', fontSize: '1rem', marginBottom: 0, background: '#fff', color: 'var(--text)' }}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
              {errors.name && (
                <div style={{ color: '#ef4444', fontSize: '0.97rem', marginTop: 4 }}>{errors.name}</div>
              )}
            </div>

            <div style={{ marginBottom: 18 }}>
              <label htmlFor="username" style={{ display: 'block', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: 6 }}>Username</label>
              <input
                type="text"
                name="username"
                style={{ width: '100%', padding: '0.7em 1em', borderRadius: 'var(--radius)', border: errors.username ? '1.5px solid #ef4444' : '1.5px solid var(--border)', fontSize: '1rem', marginBottom: 0, background: '#fff', color: 'var(--text)' }}
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
              {errors.username && (
                <div style={{ color: '#ef4444', fontSize: '0.97rem', marginTop: 4 }}>{errors.username}</div>
              )}
            </div>

            <div style={{ marginBottom: 18 }}>
              <label htmlFor="password" style={{ display: 'block', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                name="password"
                style={{ width: '100%', padding: '0.7em 1em', borderRadius: 'var(--radius)', border: errors.password ? '1.5px solid #ef4444' : '1.5px solid var(--border)', fontSize: '1rem', marginBottom: 0, background: '#fff', color: 'var(--text)' }}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
              {errors.password && (
                <div style={{ color: '#ef4444', fontSize: '0.97rem', marginTop: 4 }}>{errors.password}</div>
              )}
            </div>

            <div style={{ marginBottom: 22 }}>
              <button type="submit" className="cta-btn" style={{ width: '100%' }}>
                Register
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.98rem', marginBottom: 18 }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
              <span style={{ padding: '0 10px' }}>OR</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
            </div>

            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin onSuccess={handleGoogleSignin} onError={() => setErrors({ message: 'Google Sign-in failed' })} width="100%" theme="filled_blue"/>
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
