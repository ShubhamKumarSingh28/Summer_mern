import { Link, useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();
    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/login", label: "Login" },
        { to: "/register", label: "Register" },
    ];
    return (
        <header style={{ boxShadow: '0 2px 8px rgba(30,41,59,0.04)', background: '#fff', borderBottom: '1px solid var(--border)' }}>
            <nav className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '72px' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary) 60%, var(--accent) 100%)',
                        color: '#fff',
                        fontWeight: 900,
                        fontSize: 22,
                        letterSpacing: '-1px',
                        boxShadow: '0 2px 8px #2563eb22',
                    }}>A</span>
                    <span style={{ fontWeight: 800, fontSize: '1.45rem', color: 'var(--primary-dark)', letterSpacing: '-1px' }}>
                        Affiliate<span style={{ color: 'var(--accent)' }}>++</span>
                    </span>
                </Link>
                <ul style={{ display: 'flex', gap: '2.2em', listStyle: 'none', margin: 0, padding: 0 }}>
                    {navLinks.map(link => (
                        <li key={link.to}>
                            <Link
                                to={link.to}
                                style={{
                                    fontWeight: 600,
                                    fontSize: '1.05rem',
                                    color: location.pathname === link.to ? 'var(--primary)' : 'var(--primary-dark)',
                                    padding: '0.5em 1.1em',
                                    borderRadius: 8,
                                    background: location.pathname === link.to ? 'var(--accent)10' : 'transparent',
                                    boxShadow: location.pathname === link.to ? '0 2px 8px #22d3ee11' : 'none',
                                    transition: 'background 0.18s, color 0.18s',
                                    position: 'relative',
                                    textDecoration: 'none',
                                }}
                                onMouseOver={e => e.currentTarget.style.background = 'var(--background)'}
                                onMouseOut={e => e.currentTarget.style.background = location.pathname === link.to ? 'var(--accent)10' : 'transparent'}
                            >
                                {link.label}
                                {location.pathname === link.to && (
                                    <span style={{
                                        display: 'block',
                                        height: 3,
                                        borderRadius: 2,
                                        background: 'var(--primary)',
                                        marginTop: 4,
                                        width: '60%',
                                        marginLeft: '20%',
                                    }} />
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
