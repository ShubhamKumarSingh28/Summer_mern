import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/config";

function ResetPassword({ email: emailProp = "", hideEmailField = false, onSuccess }) {
    const location = useLocation();
    const navigate = useNavigate();
    const emailFromState = location.state?.email || emailProp;
    const shouldHideEmail = hideEmailField || !!emailProp || !!location.state?.email;

    const [formData, setFormData] = useState({
        email: emailFromState,
        code: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...formData, [name]: value };
        setFormData(updatedForm);
        setError("");
        setMessage("");
        // Show password mismatch error as user types
        if ((name === "newPassword" || name === "confirmPassword") && updatedForm.confirmPassword) {
            if (updatedForm.newPassword !== updatedForm.confirmPassword) {
                setPasswordMatchError("Passwords do not match.");
            } else {
                setPasswordMatchError("");
            }
        }
    };

    const isFormValid = () => {
        if (!shouldHideEmail && !formData.email) return false;
        if (!formData.code) return false;
        if (!formData.newPassword) return false;
        if (!formData.confirmPassword) return false;
        if (formData.newPassword !== formData.confirmPassword) return false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            if (!formData.email || !formData.code || !formData.newPassword || !formData.confirmPassword) {
                setError("Please fill in all fields.");
            } else if (formData.newPassword !== formData.confirmPassword) {
                setError("Passwords do not match.");
            }
            return;
        }
        setSubmitting(true);
        try {
            await axios.post(`${serverEndpoint}/auth/reset-password`, {
                email: formData.email,
                code: formData.code,
                newPassword: formData.newPassword
            });
            setMessage("Password reset successful.");
            setError("");
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                } else {
                    navigate("/");
                }
            }, 1500);
        } catch (err) {
            let backendMsg = err?.response?.data?.message;
            setError(backendMsg || "Failed to reset password. Check code or try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section style={{ background: 'var(--background)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container" style={{ maxWidth: 420, width: '100%' }}>
                <div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: '2.5rem 2rem', margin: '0 auto' }}>
                    <h2 style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: '2rem', marginBottom: 24, textAlign: 'center' }}>Reset Password</h2>
                    {message && <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: '8px', padding: '1em', marginBottom: '1.5em', fontWeight: 500, border: '1px solid #6ee7b7', textAlign: 'center' }}>{message}</div>}
                    {error && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '1em', marginBottom: '1.5em', fontWeight: 500, border: '1px solid #fecaca', textAlign: 'center' }}>{error}</div>}
                    {passwordMatchError && (
                        <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '1em', marginBottom: '1em', fontWeight: 500, border: '1px solid #fecaca', textAlign: 'center' }}>{passwordMatchError}</div>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                        {!shouldHideEmail && (
                            <div style={{ marginBottom: 18 }}>
                                <label htmlFor="email" style={{ display: 'block', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: 6 }}>Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    style={{ width: '100%', padding: '0.7em 1em', borderRadius: 'var(--radius)', border: error && !formData.email ? '1.5px solid #ef4444' : '1.5px solid var(--border)', fontSize: '1rem', background: '#fff', color: 'var(--text)' }}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                />
                            </div>
                        )}
                        <div style={{ marginBottom: 18 }}>
                            <label htmlFor="code" style={{ display: 'block', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: 6 }}>Reset Code</label>
                            <input
                                id="code"
                                type="text"
                                name="code"
                                style={{ width: '100%', padding: '0.7em 1em', borderRadius: 'var(--radius)', border: error && !formData.code ? '1.5px solid #ef4444' : '1.5px solid var(--border)', fontSize: '1rem', background: '#fff', color: 'var(--text)' }}
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="Enter the reset code"
                            />
                        </div>
                        <div style={{ marginBottom: 22 }}>
                            <label htmlFor="newPassword" style={{ display: 'block', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: 6 }}>New Password</label>
                            <input
                                id="newPassword"
                                type="password"
                                name="newPassword"
                                style={{ width: '100%', padding: '0.7em 1em', borderRadius: 'var(--radius)', border: error && !formData.newPassword ? '1.5px solid #ef4444' : '1.5px solid var(--border)', fontSize: '1rem', background: '#fff', color: 'var(--text)' }}
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Enter your new password"
                            />
                        </div>
                        <div style={{ marginBottom: 22 }}>
                            <label htmlFor="confirmPassword" style={{ display: 'block', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: 6 }}>Confirm New Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                style={{ width: '100%', padding: '0.7em 1em', borderRadius: 'var(--radius)', border: error && !formData.confirmPassword ? '1.5px solid #ef4444' : '1.5px solid var(--border)', fontSize: '1rem', background: '#fff', color: 'var(--text)' }}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your new password"
                            />
                        </div>
                        <button type="submit" className="cta-btn" style={{ width: '100%' }} disabled={!isFormValid() || submitting}>
                            {submitting ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
export default ResetPassword;