function Footer() {
    return (
        <footer style={{ background: '#fff', borderTop: '1px solid var(--border)', boxShadow: '0 -1px 8px rgba(30,41,59,0.03)', padding: '2.2em 0 1.2em 0', marginTop: 32 }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 24, marginBottom: 6 }}>
                    <a href="/" style={{ color: 'var(--primary-dark)', fontWeight: 600, fontSize: '1.05rem', textDecoration: 'none', transition: 'color 0.18s' }}>Home</a>
                    <a href="/login" style={{ color: 'var(--primary-dark)', fontWeight: 600, fontSize: '1.05rem', textDecoration: 'none', transition: 'color 0.18s' }}>Login</a>
                    <a href="/register" style={{ color: 'var(--primary-dark)', fontWeight: 600, fontSize: '1.05rem', textDecoration: 'none', transition: 'color 0.18s' }}>Register</a>
                </div>
                <div style={{ color: 'var(--text-light)', fontSize: '0.98rem', textAlign: 'center' }}>
                    &copy; {new Date().getFullYear()} Affiliate++. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;