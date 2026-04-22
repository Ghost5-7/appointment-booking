import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Scissors, LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    <Scissors size={24} />
                    <span>Sharp & Sleek</span>
                </Link>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <UserIcon size={18} /> {user.name} ({user.role})
                            </span>
                            {user.role === 'barber' && <Link to="/barber-dashboard" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>Dashboard</Link>}
                            <button onClick={logout} style={{ background: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>Login</Link>
                            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Join Us</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
