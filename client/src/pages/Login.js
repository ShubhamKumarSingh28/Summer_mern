import { useState } from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { serverEndpoint } from "../config/config";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions";
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.username.trim()) {
      isValid = false;
      newErrors.username = "Username is mandatory";
    }
    if (!formData.password.trim()) {
      isValid = false;
      newErrors.password = "Password is mandatory";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const body = {
        username: formData.username,
        password: formData.password,
      };
      const config = {
        withCredentials: true,
      };
      try {
        const response = await axios.post(`${serverEndpoint}/auth/login`, body, config);
        dispatch({ type: SET_USER, payload: response.data.user });
        navigate("/dashboard");
      } catch (error) {
        console.error(error);
        setErrors({ message: "Something went wrong, please try again" });
      }
    }
  };

  const handleGoogleSuccess = async (authResponse) => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/google-auth`,
        { idToken: authResponse.credential },
        { withCredentials: true }
      );
      dispatch({ type: SET_USER, payload: response.data.user });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrors({ message: "Error processing google auth, please try again" });
    }
  };

  const handleGoogleError = () => {
    setErrors({ message: "Error in Google authorization flow" });
  };

  return (
    <section style={{ background: 'var(--background)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: 420, width: '100%' }}>
        <div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: '2.5rem 2rem', margin: '0 auto' }}>
          <h2 style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '2rem', marginBottom: 24, textAlign: 'center' }}>Login</h2>

          {errors.message && (
            <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '1em', marginBottom: '1.5em', fontWeight: 500, border: '1px solid #fecaca', textAlign: 'center' }}>{errors.message}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="username" style={{ display: 'block', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: 6 }}>Username</label>
              <input
                type="text"
                name="username"
                style={{ width: '100%', padding: '0.7em 1em', borderRadius: 'var(--radius)', border: errors.username ? '1.5px solid #ef4444' : '1.5px solid var(--border)', fontSize: '1rem', marginBottom: 0, background: '#fff', color: 'var(--text)' }}
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
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
                placeholder="Enter your password"
              />
              {errors.password && (
                <div style={{ color: '#ef4444', fontSize: '0.97rem', marginTop: 4 }}>{errors.password}</div>
              )}
            </div>

            <div style={{ marginBottom: 18, textAlign: 'right' }}>
              <a href="/forget-password" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.98rem' }}>
                Forgot Password?
              </a>
            </div>

            <div style={{ marginBottom: 22 }}>
              <button type="submit" className="cta-btn" style={{ width: '100%' }}>
                Login
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.98rem', marginBottom: 18 }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
              <span style={{ padding: '0 10px' }}>OR</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
            </div>

            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} width="100%" theme="filled_blue"/>
              </GoogleOAuthProvider>
            </div>

            <p style={{ textAlign: 'center', marginTop: 24, marginBottom: 0, color: 'var(--text-light)', fontSize: '1rem' }}>
              Don't have an account?{' '}
              <a href="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
