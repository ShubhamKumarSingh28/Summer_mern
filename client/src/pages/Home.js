import { Link } from "react-router-dom";

function Home() {
    return (
        <div style={{ background: "var(--background)", minHeight: "80vh" }}>
            {/* Hero Section */}
            <section style={{ padding: "4rem 0 2.5rem 0", textAlign: "center" }}>
                <div className="container">
                    <h1 style={{ fontSize: "2.6rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-1px", color: "var(--primary-dark)" }}>
                        Welcome to Affiliate++
                    </h1>
                    <p style={{ fontSize: "1.2rem", maxWidth: 600, margin: "0 auto 2rem auto", color: "var(--text-light)" }}>
                        The modern platform to manage, track, and grow your affiliate links and earnings. Powerful analytics, easy link management, and seamless payments—all in one place.
                    </p>
                    <Link to="/register">
                        <button className="cta-btn">
                            Get Started
                        </button>
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="container" style={{ marginTop: "-1.5rem", marginBottom: "3rem" }}>
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "2rem",
                    justifyContent: "center",
                }}>
                    <div className="card" style={{ flex: "1 1 260px", minWidth: 260, maxWidth: 340, textAlign: "center", borderTop: "4px solid var(--primary)" }}>
                        <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem", color: "var(--primary)" }}>📊</div>
                        <h3 style={{ marginBottom: 8, color: "var(--primary-dark)" }}>Advanced Analytics</h3>
                        <p style={{ color: "var(--text-light)" }}>
                            Track clicks, conversions, and revenue in real time with beautiful, easy-to-read dashboards.
                        </p>
                    </div>
                    <div className="card" style={{ flex: "1 1 260px", minWidth: 260, maxWidth: 340, textAlign: "center", borderTop: "4px solid var(--accent)" }}>
                        <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem", color: "var(--accent)" }}>🔗</div>
                        <h3 style={{ marginBottom: 8, color: "var(--primary-dark)" }}>Easy Link Management</h3>
                        <p style={{ color: "var(--text-light)" }}>
                            Create, edit, and organize your affiliate links with just a few clicks. Stay organized and efficient.
                        </p>
                    </div>
                    <div className="card" style={{ flex: "1 1 260px", minWidth: 260, maxWidth: 340, textAlign: "center", borderTop: "4px solid var(--primary)" }}>
                        <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem", color: "var(--primary)" }}>💸</div>
                        <h3 style={{ marginBottom: 8, color: "var(--primary-dark)" }}>Seamless Payments</h3>
                        <p style={{ color: "var(--text-light)" }}>
                            Get paid quickly and securely. Multiple payout options and transparent transaction history.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;