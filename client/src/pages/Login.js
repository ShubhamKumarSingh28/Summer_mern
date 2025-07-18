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
    <section className="bg-light min-vh-100 d-flex align-items-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="bg-white shadow p-4 p-sm-5 rounded-4">
              <h2 className="mb-4 text-center">Login</h2>

              {errors.message && (
                <div className="alert alert-danger">{errors.message}</div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    className={`form-control ${errors.username ? "is-invalid" : ""}`}
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div className="mb-3 text-end">
                  <a href="/forget-password" className="text-decoration-none">
                    Forgot Password?
                  </a>
                </div>

                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Login
                  </button>
                </div>

                <div className="d-flex align-items-center text-muted mb-3">
                  <hr className="flex-grow-1" />
                  <span className="px-2">OR</span>
                  <hr className="flex-grow-1" />
                </div>

                <div className="text-center">
                  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                  </GoogleOAuthProvider>
                </div>

                <p className="text-center mt-4 mb-0">
                  Don't have an account?{" "}
                  <a href="/register" className="text-primary fw-semibold">
                    Register
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
