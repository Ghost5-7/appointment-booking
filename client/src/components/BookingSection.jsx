import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const BookingSection = () => {
    const { user } = useAuth();
    const [barbers, setBarbers] = useState([]);
    const [selectedBarber, setSelectedBarber] = useState('');
    const [selectedService, setSelectedService] = useState('Haircut');
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchBarbers = async () => {
            const res = await axios.get('/api/barbers');
            // Filter out current user if they are a barber
            const filteredBarbers = user?.role === 'barber' 
                ? res.data.filter(b => b.id !== user.id)
                : res.data;
            
            setBarbers(filteredBarbers);
            if (filteredBarbers.length > 0) setSelectedBarber(filteredBarbers[0].id);
        };
        fetchBarbers();
    }, [user]);

    useEffect(() => {
        const fetchSlots = async () => {
            if (selectedBarber && selectedDate) {
                const res = await axios.get(`/api/appointments/slots?barberId=${selectedBarber}&date=${selectedDate}`);
                setAvailableSlots(res.data);
                setSelectedSlot('');
            }
        };
        fetchSlots();
    }, [selectedBarber, selectedDate]);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) {
            setMessage('Please login to book an appointment.');
            return;
        }
        if (!selectedSlot) return;

        try {
            await axios.post('/api/appointments/book', {
                barberId: selectedBarber,
                service: selectedService,
                date: selectedDate,
                timeSlot: selectedSlot
            });
            setMessage('Booking successful! Check your email for confirmation.');
            // Refresh slots
            setAvailableSlots(availableSlots.filter(s => s !== selectedSlot));
            setSelectedSlot('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Booking failed.');
        }
    };

    return (
        <section id="booking" style={{ padding: '80px 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="card">
                    <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Reserve Your Slot</h2>
                    
                    <form onSubmit={handleBooking}>
                        <div style={{ marginBottom: '20px' }}>
                            <label>Choose a Barber</label>
                            <select value={selectedBarber} onChange={(e) => setSelectedBarber(e.target.value)}>
                                {barbers.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label>Service</label>
                            <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                                <option value="Haircut">Haircut (30 mins)</option>
                                <option value="Beard trim">Beard trim (30 mins)</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label>Date</label>
                            <input 
                                type="date" 
                                min={format(new Date(), 'yyyy-MM-dd')}
                                value={selectedDate} 
                                onChange={(e) => setSelectedDate(e.target.value)} 
                            />
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label>Available Times</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', marginTop: '10px' }}>
                                {availableSlots.length > 0 ? (
                                    availableSlots.map(slot => (
                                        <button 
                                            key={slot}
                                            type="button"
                                            onClick={() => setSelectedSlot(slot)}
                                            style={{
                                                padding: '10px',
                                                backgroundColor: selectedSlot === slot ? 'var(--accent)' : 'var(--bg-primary)',
                                                color: selectedSlot === slot ? 'var(--bg-primary)' : 'var(--text-primary)',
                                                border: '1px solid var(--border)'
                                            }}
                                        >
                                            {slot}
                                        </button>
                                    ))
                                ) : (
                                    <p style={{ gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>No slots available for this date.</p>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={!selectedSlot}>
                            Confirm Booking
                        </button>
                    </form>

                    {message && (
                        <p style={{ marginTop: '20px', textAlign: 'center', color: message.includes('failed') ? 'var(--error)' : 'var(--success)' }}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BookingSection;
