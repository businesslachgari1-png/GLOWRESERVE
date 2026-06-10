import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MyAppointmentsPage = () => {
    const { token } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [activeAppointmentForReview, setActiveAppointmentForReview] = useState(null);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/my-appointments', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelAppointment = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;
        try {
            const response = await fetch(`http://localhost:8000/api/appointments/${id}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            if (response.ok) { fetchAppointments(); }
        } catch (error) {
            console.error('Error cancelling:', error);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        setSubmittingReview(true);
        try {
            const response = await fetch('http://localhost:8000/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    appointment_id: activeAppointmentForReview.id,
                    rating: newReview.rating,
                    comment: newReview.comment
                })
            });

            if (response.ok) {
                setReviewModalOpen(false);
                setNewReview({ rating: 5, comment: '' });
                fetchAppointments(); // Refresh to show it as reviewed
                alert('MERCI POUR VOTRE AVIS !');
            } else {
                const err = await response.json();
                alert(err.error || 'Erreur lors de la soumission');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Erreur réseau');
        } finally {
            setSubmittingReview(false);
        }
    };

    const openReviewModal = (apt) => {
        setActiveAppointmentForReview(apt);
        setNewReview({ rating: 5, comment: '' });
        setReviewModalOpen(true);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#D4A574',    // beige
            confirmed: '#2D2A26',  // black
            completed: '#4CAF50',  // green for completed
            cancelled: '#ef4444'   // red
        };
        return colors[status] || '#999';
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'EN ATTENTE D\'APPROBATION',
            confirmed: 'RÉSERVATION CONFIRMÉE',
            completed: 'PRESTATION RÉALISÉE',
            cancelled: 'RENDEZ-VOUS ANNULÉ'
        };
        return labels[status] || status.toUpperCase();
    };

    if (loading) {
        return <div style={{ padding: '10rem 2rem', textAlign: 'center', fontWeight: 600 }}>CHARGEMENT DE VOTRE ESPACE...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: '10rem', paddingBottom: '6rem' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <header style={{ marginBottom: '4rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.2em' }}>ESPACE MEMBRE</span>
                    <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>HISTORIQUE DES RENDEZ-VOUS</h1>
                </header>

                {appointments.length === 0 ? (
                    <div style={{ padding: '6rem 2rem', textAlign: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', background: 'white' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>AUCUN RENDEZ-VOUS ENREGISTRÉ.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {appointments.map(apt => (
                            <div key={apt.id} style={{ padding: '2.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.25rem' }}>{apt.salon.name.toUpperCase()}</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{apt.salon.city.toUpperCase()} — {apt.salon.address}</p>
                                    </div>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.1em',
                                        color: getStatusColor(apt.status),
                                        padding: '0.5rem 1rem',
                                        border: `1px solid ${getStatusColor(apt.status)}`,
                                        borderRadius: '100px'
                                    }}>
                                        {getStatusLabel(apt.status)}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', fontSize: '0.85rem', background: 'var(--bg)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                    <div>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>PRESTATION</span>
                                        <span style={{ fontWeight: 800 }}>{apt.service.name.toUpperCase()}</span>
                                    </div>
                                    {apt.employee && (
                                        <div>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>PRIS EN CHARGE PAR</span>
                                            <span style={{ fontWeight: 800 }}>{apt.employee.name.toUpperCase()}</span>
                                        </div>
                                    )}
                                    <div>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>DATE ET HEURE</span>
                                        <span style={{ fontWeight: 800 }}>
                                            {new Date(apt.appointment_time).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} — {new Date(apt.appointment_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>MONTANT</span>
                                        <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '1.1rem' }}>{Math.round(apt.total_price)} DH</span>
                                    </div>
                                </div>

                                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    {(apt.status === 'pending' || apt.status === 'confirmed') && (
                                        <button
                                            onClick={() => cancelAppointment(apt.id)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.05em' }}
                                        >
                                            ANNULER LA RÉSERVATION
                                        </button>
                                    )}

                                    {apt.status === 'completed' && !apt.review && (
                                        <button
                                            onClick={() => openReviewModal(apt)}
                                            style={{ background: 'var(--text)', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.05em' }}
                                        >
                                            ÉVALUER LA PRESTATION
                                        </button>
                                    )}

                                    {apt.status === 'completed' && apt.review && (
                                        <span style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                                            ✓ AVIS LAISSÉ ({apt.review.rating}/5)
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {reviewModalOpen && activeAppointmentForReview && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: 'var(--bg)', padding: '3rem', borderRadius: 'var(--radius-xl)', maxWidth: '500px', width: '100%', border: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>VOTRE AVIS NOUS INTÉRESSE</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Comment jugeriez-vous la prestation de {activeAppointmentForReview.salon.name} ?</p>

                        <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>NOTE SUR 5</label>
                                <select
                                    value={newReview.rating}
                                    onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                    style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontWeight: 700 }}
                                >
                                    <option value={5}>5 - Excellent</option>
                                    <option value={4}>4 - Très bien</option>
                                    <option value={3}>3 - Correct</option>
                                    <option value={2}>2 - Décevant</option>
                                    <option value={1}>1 - Mauvais</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>VOTRE RETOUR (OPTIONNEL)</label>
                                <textarea
                                    placeholder="Partagez votre expérience..."
                                    style={{ width: '100%', minHeight: '100px', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit' }}
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submittingReview}>
                                    {submittingReview ? 'ENVOI...' : 'PARTAGER MON AVIS'}
                                </button>
                                <button type="button" onClick={() => setReviewModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>ANNULER</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointmentsPage;
