import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SalonDetailPage = () => {
    const { user, token } = useAuth();
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [appointmentIdForReview, setAppointmentIdForReview] = useState(null);

    

    const { slug } = useParams();
    const navigate = useNavigate();
    const [salon, setSalon] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [appointmentsCompleted, setAppointmentsCompleted] = useState([]);
    const [canLeaveReview, setCanLeaveReview] = useState(false);
    const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState(null);


    useEffect(() => {
        fetchSalon();
    }, [slug]);

    const fetchSalon = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/salons/${slug}`);
            const data = await response.json();
            setSalon(data);

            const reviewsResponse = await fetch(`http://localhost:8000/api/salons/${data.id}/reviews`);
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData);

            // Eligibility for leaving a review (only after completed appointments)
            if (token) {
                const aptRes = await fetch(`http://localhost:8000/api/salons/${data.id}/completed-appointments`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (aptRes.ok) {
                    const aptData = await aptRes.json();
                    setAppointmentsCompleted(aptData);

                    const eligible = aptData.find((apt) => !apt.review);
                    setCanLeaveReview(Boolean(eligible));
                    setSelectedAppointmentForReview(eligible || null);
                } else {
                    setAppointmentsCompleted([]);
                    setCanLeaveReview(false);
                    setSelectedAppointmentForReview(null);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '10rem 2rem', textAlign: 'center', fontWeight: 600 }}>CHARGEMENT...</div>;
    }

    if (!salon) {
        return <div style={{ padding: '10rem 2rem', textAlign: 'center' }}>Salon non trouvé</div>;
    }

    const openReviewModal = () => {
        // Sélectionne un rendez-vous completed éligible
        if (!selectedAppointmentForReview) return;
        setAppointmentIdForReview(selectedAppointmentForReview.id);
        setNewReview({ rating: 5, comment: '' });
        setReviewModalOpen(true);
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!token || !user) {
            alert('Veuillez vous connecter pour laisser un avis.');
            return;
        }

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
                    appointment_id: appointmentIdForReview,
                    rating: newReview.rating,
                    comment: newReview.comment,
                })
            });

            if (response.ok) {
                setReviewModalOpen(false);
                setNewReview({ rating: 5, comment: '' });
                // re-fetch reviews
                const reviewsResponse = await fetch(`http://localhost:8000/api/salons/${salon.id}/reviews`);
                const reviewsData = await reviewsResponse.json();
                setReviews(reviewsData);
                alert('MERCI POUR VOTRE AVIS !');
            } else {
                const err = await response.json();
                alert(err.error || err.message || 'Erreur lors de la soumission');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Erreur réseau');
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '10rem', paddingBottom: '6rem' }}>
            <div className="container" style={{ maxWidth: '900px' }}>

                <button onClick={() => navigate(-1)} style={{
                    marginBottom: '2rem',
                    background: 'none',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    color: 'var(--text-muted)'
                }}>
                    ← RETOUR
                </button>

                {/* Header Section */}
                <header style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.2em', display: 'block', marginBottom: '0.5rem' }}>{salon.city.toUpperCase()}</span>
                            <h1 style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>{salon.name}</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{salon.address}</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem 2rem', background: 'var(--bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>{salon.rating}</div>
                            <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{reviews.length} AVIS</div>
                        </div>
                    </div>

                    {salon.description && (
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text)', marginBottom: '3rem' }}>
                            {salon.description}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '3rem', fontSize: '0.85rem', fontWeight: 600, borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                        {salon.phone && <span>TÉL: {salon.phone}</span>}
                        {salon.email && <span>EMAIL: {salon.email}</span>}
                    </div>
                </header>

                {/* Services */}
                <div style={{ marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>PRESTATIONS</h2>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {salon.services?.map(service => (
                            <div key={service.id} style={{
                                padding: '1.5rem',
                                background: 'white',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                gap: '1.5rem',
                                alignItems: 'center',
                                transition: 'var(--transition)'
                            }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                                {service.image_url && (
                                    <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={`http://localhost:8000${service.image_url}`} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{service.name.toUpperCase()}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{service.duration_minutes} MIN</p>
                                    {service.description && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text)', marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{service.description}</p>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{Math.round(service.price)} DH</span>
                                    <button onClick={() => navigate(`/booking/${salon.slug}`)} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem' }}>
                                        RÉSERVER
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team / Staff */}
                {salon.employees && salon.employees.length > 0 && (
                    <div style={{ marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>NOTRE ÉQUIPE</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {salon.employees.map(emp => (
                                <div key={emp.id} style={{
                                    padding: '2rem',
                                    background: 'var(--bg)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--text)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, margin: '0 auto 1.5rem' }}>
                                        {emp.name.charAt(0).toUpperCase()}
                                    </div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>{emp.name.toUpperCase()}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em' }}>{emp.role ? emp.role.toUpperCase() : 'EXPERT'}</p>
                                    {emp.bio && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem', fontStyle: 'italic', lineHeight: 1.6 }}>"{emp.bio}"</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.8rem' }}>AVIS CLIENTS</h2>
                        {canLeaveReview ? (
                            <button
                                onClick={openReviewModal}
                                className="btn btn-primary"
                                style={{ padding: '0.6rem 1.4rem', fontSize: '0.75rem', fontWeight: 800 }}
                            >
                                LAISSER UN AVIS
                            </button>
                        ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>
                                Laissez un avis après la réalisation de la prestation.
                            </span>
                        )}

                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <div key={review.id} style={{ padding: '2rem', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{review.user?.name || 'ANONYME'}</div>
                                        <div style={{ color: 'var(--primary)', fontWeight: 800 }}>{review.rating}/5</div>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>AUCUN AVIS POUR LE MOMENT.</p>
                        )}
                    </div>
                </div>
            </div>

            {reviewModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: 'var(--bg)', padding: '3rem', borderRadius: 'var(--radius-xl)', maxWidth: '500px', width: '100%', border: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>VOTRE AVIS NOUS INTÉRESSE</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Comment jugeriez-vous la prestation de {salon.name} ?</p>

                        <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {!canLeaveReview && (
                                <p style={{ color: 'var(--text-muted)', fontWeight: 700, margin: 0 }}>
                                    Impossible de laisser un avis tant que la prestation n\'est pas réalisée.
                                </p>
                            )}

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>NOTE SUR 5</label>
                                <select
                                    value={newReview.rating}
                                    onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                    style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontWeight: 700 }}
                                    disabled={!canLeaveReview}
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
                                <button type="button" onClick={() => setReviewModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>
                                    ANNULER
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SalonDetailPage;
