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
        try {
     await axios.post(`${serverEndpoint}/auth/send-reset-password-token`, { email });
            setMessage("Reset code sent to your email.");
            setTimeout(() => navigate("/reset-password", { state: { email } }), 1500);
        } catch (err) {
     setError("Failed to send reset code. Try again.");
    }
    };
     return (
    <div className="container mt-5 col-md-4">
      <h3>Forgot Password</h3>
    {message && <div className="alert alert-success">{message}</div>}
    {error && <div className="alert alert-danger">{error}</div>}
    <form onSubmit={handleSubmit}>
<div className="mb-3">
<label>Email</label>
<input
    type="email"
    className="form-control"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
/>
</div>
            <button className="btn btn-primary w-100">Send Reset Code</button>
            </form>
         </div>
    );
}

export default ForgetPassword;
