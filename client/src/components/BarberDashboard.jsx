import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Calendar, Clock, User as UserIcon, Save, Settings } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const BarberDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('schedule');
    const [specialties, setSpecialties] = useState([]);
    const [workingHours, setWorkingHours] = useState(
        DAYS.map(day => ({ day, start: '09:00', end: '17:00', isOff: false }))
    );
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [appRes, profRes] = await Promise.all([
                    axios.get('/api/appointments/barber-schedule'),
                    axios.get(`/api/barbers/${user.id}`).catch(() => ({ data: null }))
                ]);
                
                setAppointments(appRes.data);
                if (profRes.data) {
                    setWorkingHours(profRes.data.workingHours);
                    setSpecialties(profRes.data.specialties || []);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user.id]);

    const handleSaveAvailability = async () => {
        try {
            await axios.put('/api/barbers/availability', {
                workingHours,
                specialties
            });
            setMessage('Availability updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update availability.');
        }
    };

    const updateHour = (day, field, value) => {
        setWorkingHours(hours => hours.map(h => 
            h.day === day ? { ...h, [field]: value } : h
        ));
    };

    if (loading) return <div className="container" style={{ padding: '80px 0' }}>Loading dashboard...</div>;

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1>Barber Dashboard</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setActiveTab('schedule')}
                        style={{ padding: '10px 20px', border: '1px solid var(--border)', backgroundColor: activeTab === 'schedule' ? 'var(--accent)' : 'var(--bg-secondary)', color: activeTab === 'schedule' ? 'var(--bg-secondary)' : 'var(--text-primary)' }}
                    >
                        <Calendar size={18} style={{ marginRight: '8px' }} /> Schedule
                    </button>
                    <button 
                        onClick={() => setActiveTab('availability')}
                        style={{ padding: '10px 20px', border: '1px solid var(--border)', backgroundColor: activeTab === 'availability' ? 'var(--accent)' : 'var(--bg-secondary)', color: activeTab === 'availability' ? 'var(--bg-secondary)' : 'var(--text-primary)' }}
                    >
                        <Settings size={18} style={{ marginRight: '8px' }} /> Availability
                    </button>
                </div>
            </div>

            {activeTab === 'schedule' ? (
                <div className="card">
                    <h3 style={{ marginBottom: '20px' }}>Upcoming Appointments</h3>
                    {appointments.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {appointments.map(app => (
                                <div key={app._id} style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>{app.service}</p>
                                        <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <UserIcon size={14} /> {app.customer.name}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'flex-end' }}>
                                            <Clock size={16} /> {app.timeSlot}
                                        </p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            {format(new Date(app.date), 'EEEE, MMM dd')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>No appointments found.</p>
                    )}
                </div>
            ) : (
                <div className="card">
                    <h3 style={{ marginBottom: '30px' }}>Manage Working Hours</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                        {workingHours.map(hour => (
                            <div key={hour.day} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 100px', gap: '20px', alignItems: 'center', padding: '15px', borderBottom: '1px solid var(--border)' }}>
                                <span style={{ fontWeight: '600' }}>{hour.day}</span>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Start Time</label>
                                    <input 
                                        type="time" 
                                        value={hour.start} 
                                        disabled={hour.isOff}
                                        onChange={(e) => updateHour(hour.day, 'start', e.target.value)}
                                        style={{ marginTop: '0' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>End Time</label>
                                    <input 
                                        type="time" 
                                        value={hour.end} 
                                        disabled={hour.isOff}
                                        onChange={(e) => updateHour(hour.day, 'end', e.target.value)}
                                        style={{ marginTop: '0' }}
                                    />
                                </div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={hour.isOff} 
                                        onChange={(e) => updateHour(hour.day, 'isOff', e.target.checked)}
                                        style={{ width: 'auto', marginTop: '0' }}
                                    />
                                    <span>Off</span>
                                </label>
                            </div>
                        ))}
                    </div>
                    
                    <button onClick={handleSaveAvailability} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%' }}>
                        <Save size={18} /> Save Settings
                    </button>
                    {message && <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--success)' }}>{message}</p>}
                </div>
            )}
        </div>
    );
};

export default BarberDashboard;
