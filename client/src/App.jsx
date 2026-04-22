import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingSection from './components/BookingSection';
import Login from './components/Login';
import Register from './components/Register';
import BarberDashboard from './components/BarberDashboard';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
};

const Home = () => {
    const { user } = useAuth();
    if (user?.role === 'barber') {
        return <Navigate to="/barber-dashboard" />;
    }
    return (
        <>
            <Hero />
            <BookingSection />
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Navbar />
                    <main style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/barber-dashboard" element={
                                <ProtectedRoute role="barber">
                                    <BarberDashboard />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </main>
                    <footer style={{ padding: '40px 0', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <div className="container">
                            &copy; {new Date().getFullYear()} Sharp & Sleek Barber Shop. All rights reserved.
                        </div>
                    </footer>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
