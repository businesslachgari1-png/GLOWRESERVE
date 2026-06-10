import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BookingPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [salon, setSalon] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [slotsError, setSlotsError] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
        fetchSalon();
    }, [slug]);

    useEffect(() => {
        if (selectedService && selectedDate && salon?.id && step >= 3) {
            fetchAvailableSlots();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedService, selectedDate, selectedEmployee, salon?.id, step]);

    const fetchSalon = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/salons/${slug}`);
            const data = await response.json();
            setSalon(data);
        } catch (error) {
            console.error('Error fetching salon:', error);
        }
    };

    const fetchAvailableSlots = async () => {
        if (!salon?.id || !selectedService?.id || !selectedDate) return;
        try {
            setSlotsError('');
            const params = new URLSearchParams({
                salon_id: salon.id,
                service_id: selectedService.id,
                date: selectedDate,
                ...(selectedEmployee && selectedEmployee !== 'any' && { employee_id: selectedEmployee.id })
            });
            const headers = {
                Accept: 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            };
            const response = await fetch(`http://localhost:8000/api/appointments/available-slots?${params}`, { headers });
            const data = await response.json();
            if (!response.ok) {
                setSlotsError(data?.error || 'Impossible de charger les créneaux.');
                setAvailableSlots([]);
                return;
            }
            if (Array.isArray(data)) {
                setAvailableSlots(data);
            } else if (Array.isArray(data?.slots)) {
                setAvailableSlots(data.slots);
            } else {
                setSlotsError('Format de réponse inattendu.');
                setAvailableSlots([]);
            }
        } catch (error) {
            setSlotsError('Erreur réseau.');
            setAvailableSlots([]);
        }
    };

    const handleBooking = async () => {
        if (!user) { navigate('/auth'); return; }
        setLoading(true);
        try {
            const bodyData = {
                salon_id: salon.id,
                service_id: selectedService.id,
                appointment_time: selectedTime,
                notes,
            };
            if (selectedEmployee && selectedEmployee !== 'any') {
                bodyData.employee_id = selectedEmployee.id;
            }

            const response = await fetch('http://localhost:8000/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
                body: JSON.stringify(bodyData),
            });
            if (response.ok) {
                alert('RÉSERVATION CONFIRMÉE !');
                navigate('/my-appointments');
            } else {
                const error = await response.json();
                alert(error.error || error.message || 'Erreur lors de la réservation');
            }
        } catch (error) {
            alert('Erreur réseau');
        } finally {
            setLoading(false);
        }
    };

    if (!salon) return <div style={{ minHeight: '100vh', paddingTop: '10rem', textAlign: 'center', fontWeight: 700 }}>CHARGEMENT...</div>;

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '10rem', paddingBottom: '6rem' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    ← RETOUR
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '4rem', alignItems: 'start' }}>
                    <div>
                        <header style={{ marginBottom: '3rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.2em' }}>RÉSERVATION</span>
                            <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{salon.name.toUpperCase()}</h1>
                        </header>

                        {/* Step 1: Prestation */}
                        <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <span style={{ width: '2rem', height: '2rem', background: step >= 1 ? 'var(--primary)' : 'var(--border)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>1</span>
                                <h3 style={{ fontSize: '1.2rem' }}>CHOISISSEZ UNE PRESTATION</h3>
                            </div>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                {salon.services?.map((service) => (
                                    <div
                                        key={service.id}
                                        onClick={() => { setSelectedService(service); setStep(2); }}
                                        style={{
                                            padding: '1.5rem',
                                            border: '1px solid',
                                            borderColor: selectedService?.id === service.id ? 'var(--text)' : 'var(--border)',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            transition: 'var(--transition)',
                                            background: selectedService?.id === service.id ? 'var(--text)' : 'transparent',
                                            color: selectedService?.id === service.id ? 'white' : 'var(--text)',
                                            display: 'flex',
                                            gap: '1.5rem',
                                            alignItems: 'center'
                                        }}
                                    >
                                        {service.image_url && (
                                            <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                                                <img src={`http://localhost:8000${service.image_url}`} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        )}
                                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>{service.name.toUpperCase()}</h4>
                                                <span style={{ fontSize: '0.75rem', color: selectedService?.id === service.id ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>{service.duration_minutes} MIN</span>
                                            </div>
                                            <span style={{ fontWeight: 800, fontSize: '1rem', color: selectedService?.id === service.id ? 'var(--primary)' : 'var(--text)' }}>{Math.round(service.price)} DH</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Employee */}
                        {step >= 2 && selectedService && (
                            <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                    <span style={{ width: '2rem', height: '2rem', background: step >= 2 ? 'var(--primary)' : 'var(--border)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>2</span>
                                    <h3 style={{ fontSize: '1.2rem' }}>CHOIX DU COLLABORATEUR</h3>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                                    <div
                                        onClick={() => { setSelectedEmployee('any'); setStep(3); setSelectedDate(''); setSelectedTime(''); }}
                                        style={{
                                            padding: '1.5rem',
                                            textAlign: 'center',
                                            border: '1px solid',
                                            borderColor: selectedEmployee === 'any' ? 'var(--text)' : 'var(--border)',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            background: selectedEmployee === 'any' ? 'var(--text)' : 'transparent',
                                            color: selectedEmployee === 'any' ? 'white' : 'var(--text)',
                                            transition: 'var(--transition)'
                                        }}
                                    >
                                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em' }}>PEU IMPORTE</h4>
                                        <p style={{ fontSize: '0.7rem', marginTop: '0.5rem', opacity: 0.7 }}>PROCHAIN DISPONIBLE</p>
                                    </div>

                                    {salon.employees?.map(emp => (
                                        <div
                                            key={emp.id}
                                            onClick={() => { setSelectedEmployee(emp); setStep(3); setSelectedDate(''); setSelectedTime(''); }}
                                            style={{
                                                padding: '1.5rem',
                                                textAlign: 'center',
                                                border: '1px solid',
                                                borderColor: selectedEmployee?.id === emp.id ? 'var(--text)' : 'var(--border)',
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                background: selectedEmployee?.id === emp.id ? 'var(--text)' : 'transparent',
                                                color: selectedEmployee?.id === emp.id ? 'white' : 'var(--text)',
                                                transition: 'var(--transition)'
                                            }}
                                        >
                                            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em' }}>{emp.name.toUpperCase()}</h4>
                                            <p style={{ fontSize: '0.7rem', marginTop: '0.5rem', opacity: 0.7 }}>{emp.role ? emp.role.toUpperCase() : 'MEMBRE'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Date & Slots */}
                        {step >= 3 && selectedEmployee && (
                            <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                    <span style={{ width: '2rem', height: '2rem', background: step >= 3 ? 'var(--primary)' : 'var(--border)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>3</span>
                                    <h3 style={{ fontSize: '1.2rem' }}>DATE ET CRÉNEAU</h3>
                                </div>
                                <div style={{ marginBottom: '2rem' }}>
                                    <input
                                        type="date"
                                        min={getTomorrowDate()}
                                        value={selectedDate}
                                        onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                                        style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit' }}
                                    />
                                </div>

                                {slotsError && <p style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>{slotsError}</p>}

                                {selectedDate && availableSlots.length === 0 && !slotsError && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>AUCUN CRÉNEAU DISPONIBLE À CETTE DATE.</p>
                                )}

                                {selectedDate && availableSlots.length > 0 && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.75rem' }}>
                                        {availableSlots.map((slot, index) => (
                                            <button
                                                key={index}
                                                onClick={() => { setSelectedTime(slot.datetime); setStep(4); }}
                                                style={{
                                                    padding: '0.75rem',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 800,
                                                    borderRadius: 'var(--radius-md)',
                                                    border: '1px solid var(--border)',
                                                    background: selectedTime === slot.datetime ? 'var(--text)' : 'white',
                                                    color: selectedTime === slot.datetime ? 'var(--primary)' : 'var(--text)',
                                                    cursor: 'pointer',
                                                    transition: 'var(--transition)'
                                                }}
                                            >
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 4: Notes */}
                        {step >= 4 && selectedTime && (
                            <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <span style={{ width: '2rem', height: '2rem', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>4</span>
                                    <h3 style={{ fontSize: '1.2rem' }}>NOTES</h3>
                                </div>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="BESOINS PARTICULIERS ?"
                                    style={{ width: '100%', minHeight: '100px', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontFamily: 'inherit' }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Summary Sidebar */}
                    <aside style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
                        <div style={{ background: 'var(--text)', color: 'white', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--text)' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2.5rem', letterSpacing: '0.1em' }}>RÉCAPITULATIF</h3>

                            {selectedService && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 800, letterSpacing: '0.05em' }}>PRESTATION</span>
                                    <p style={{ fontWeight: 800, marginTop: '0.4rem', fontSize: '1rem' }}>{selectedService.name.toUpperCase()}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.2rem' }}>{selectedService.duration_minutes} MIN</p>
                                </div>
                            )}

                            {selectedEmployee && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 800, letterSpacing: '0.05em' }}>COLLABORATEUR</span>
                                    <p style={{ fontWeight: 800, marginTop: '0.4rem', fontSize: '1rem' }}>{selectedEmployee === 'any' ? 'PEU IMPORTE' : selectedEmployee.name.toUpperCase()}</p>
                                </div>
                            )}

                            {selectedDate && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 800, letterSpacing: '0.05em' }}>DATE & HEURE</span>
                                    <p style={{ fontWeight: 800, marginTop: '0.4rem', fontSize: '1rem' }}>{new Date(selectedDate).toLocaleDateString('fr-FR')} {selectedTime ? `À ${selectedTime.split('T')[1]?.substring(0, 5)}` : ''}</p>
                                </div>
                            )}

                            <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '2.5rem', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>TOTAL À RÉGLER</span>
                                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>{selectedService ? Math.round(selectedService.price) : 0} DH</span>
                                </div>
                                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', textAlign: 'right' }}>PAIEMENT SUR PLACE</p>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={!selectedTime || loading}
                                className="btn btn-primary"
                                style={{ width: '100%', opacity: (!selectedTime || loading) ? 0.3 : 1, padding: '1.25rem' }}
                            >
                                {loading ? 'TRAITEMENT EN COURS...' : 'CONFIRMER LA RÉSERVATION'}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
