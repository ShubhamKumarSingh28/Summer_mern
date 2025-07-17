import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Can from "../rbac/Can";
import { useState } from "react";
import axios from "axios";
import ResetPassword from "../pages/ResetPassword";
import { serverEndpoint } from "../config/config";

function UserHeader() {
    const userDetails = useSelector((state) => state.userDetails);
    const [showReset, setShowReset] = useState(false);
    const [resetError, setResetError] = useState("");
    const [resetLoading, setResetLoading] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    const handleResetPassword = async () => {
        setResetLoading(true);
        setResetError("");
        try {
            await axios.post(`${serverEndpoint}/auth/send-reset-password-token`, { email: userDetails.email });
            setResetEmail(userDetails.email);
            setShowReset(true);
        } catch (err) {
            setResetError("Failed to send reset code. Try again.");
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        Dashboard
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {/* Add other nav links here if needed */}
                        </ul>
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item dropdown">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {userDetails ? (userDetails.name) : (<>Account</>)}
                                </Link>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <Link className="dropdown-item" to="/manage-payments">
                                            Manage Payments
                                        </Link>
                                    </li>
                                    <Can permission='canViewUser'>
                                        <li>
                                            <Link className="dropdown-item" to="/users">
                                                Manage Users
                                            </Link>
                                        </li>
                                    </Can>
                                    <li>
                                        <button className="dropdown-item" onClick={handleResetPassword} disabled={resetLoading}>
                                            {resetLoading ? "Sending..." : "Reset Password"}
                                        </button>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/logout">
                                            Logout
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {showReset && (
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center" style={{ zIndex: 9999 }}>
                    <div className="bg-white p-4 rounded shadow" style={{ minWidth: 350, position: 'relative' }}>
                        <button className="btn-close position-absolute top-0 end-0 m-2" onClick={() => setShowReset(false)}></button>
                        <h5 className="mb-3">Reset Password</h5>
                        {resetError && <div className="alert alert-danger">{resetError}</div>}
                        <ResetPassword email={resetEmail} hideEmailField={true} onSuccess={() => setShowReset(false)} />
                    </div>
                </div>
            )}
        </>
    );
}

export default UserHeader;