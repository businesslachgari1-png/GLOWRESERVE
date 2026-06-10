import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SalonDashboard = () => {
    const { token } = useAuth();
    const [salon, setSalon] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showStaffModal, setShowStaffModal] = useState(false);

    const [newService, setNewService] = useState({ name: '', description: '', price: '', duration_minutes: 60, category: '' });
    const [serviceImage, setServiceImage] = useState(null);
    const [newStaff, setNewStaff] = useState({ name: '', role: '', bio: '' });
    const [salonPreProfile, setSalonPreProfile] = useState({ name: '', address: '', city: 'Casablanca', phone: '', description: '' });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchSalon();
            fetchAppointments();
        }
    }, [token]);

    const fetchSalon = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/salon-management/my-salon', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                setSalon(data);
                setSalonPreProfile({
                    name: data.name || '',
                    address: data.address || '',
                    city: data.city || 'Casablanca',
                    phone: data.phone || '',
                    description: data.description || ''
                });
            } else {
                setSalon(null);
            }
        } catch (error) {
            console.error('Error fetching salon:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/salon-management/appointments', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const addService = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newService.name);
            formData.append('description', newService.description);
            formData.append('price', newService.price);
            formData.append('duration_minutes', newService.duration_minutes);
            if (newService.category) formData.append('category', newService.category);
            if (serviceImage) formData.append('image', serviceImage);

            const response = await fetch('http://localhost:8000/api/salon-management/services', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData
            });
            if (response.ok) {
                setShowServiceModal(false);
                setNewService({ name: '', description: '', price: '', duration_minutes: 60, category: '' });
                setServiceImage(null);
                fetchSalon();
            }
        } catch (error) {
            console.error('Error adding service:', error);
        }
    };

    const addStaff = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/salon-management/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(newStaff)
            });
            if (response.ok) {
                setShowStaffModal(false);
                setNewStaff({ name: '', role: '', bio: '' });
                fetchSalon();
            }
        } catch (error) {
            console.error('Error adding staff:', error);
        }
    };

    const updateSalonProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/salon-management/salon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(salonPreProfile)
            });
            if (response.ok) {
                const data = await response.json();
                setSalon(data);
                alert('Profil du salon mis à jour avec succès.');
                fetchSalon(); // refresh entirely
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const updateAppointmentStatus = async (id, status) => {
        try {
            const response = await fetch(`http://localhost:8000/api/salon-management/appointments/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) { fetchAppointments(); }
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    if (loading) {
        return <div style={{ minHeight: '100vh', paddingTop: '10rem', textAlign: 'center', fontWeight: 700 }}>CHARGEMENT...</div>;
    }

    if (!salon && activeTab !== 'settings') {
        // Force them to create a salon first
        return (
            <div style={{ minHeight: '100vh', paddingTop: '10rem', paddingBottom: '6rem' }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.2em' }}>BIENVENUE</span>
                        <h1 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>CONFIGURATION DU SALON</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>Veuillez configurer votre établissement pour commencer à accepter des réservations.</p>
                    </header>
                    <div style={{ background: 'white', padding: '3rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
                        <form onSubmit={updateSalonProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <input type="text" placeholder="NOM DU SALON" value={salonPreProfile.name} onChange={(e) => setSalonPreProfile({ ...salonPreProfile, name: e.target.value })} required />
                            <input type="text" placeholder="ADRESSE COMPLETE" value={salonPreProfile.address} onChange={(e) => setSalonPreProfile({ ...salonPreProfile, address: e.target.value })} required />
                            <select value={salonPreProfile.city} onChange={(e) => setSalonPreProfile({ ...salonPreProfile, city: e.target.value })} required style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                <option value="Casablanca">CASABLANCA</option>
                                <option value="Marrakech">MARRAKECH</option>
                                <option value="Rabat">RABAT</option>
                            </select>
                            <input type="tel" placeholder="TÉLÉPHONE" value={salonPreProfile.phone} onChange={(e) => setSalonPreProfile({ ...salonPreProfile, phone: e.target.value })} required />
                            <textarea placeholder="DESCRIPTION DE L'ÉTABLISSEMENT" value={salonPreProfile.description} onChange={(e) => setSalonPreProfile({ ...salonPreProfile, description: e.target.value })} required style={{ minHeight: '120px', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit' }} />
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>ENREGISTRER</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    const stats = {
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(a => a.status === 'pending').length,
        revenue: appointments.filter(a => (a.status === 'completed' || a.status === 'confirmed')).reduce((sum, a) => sum + parseFloat(a.total_price), 0),
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '10rem', paddingBottom: '6rem' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <header style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
                        <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.2em' }}>TABLEAU DE BORD PROFESSIONNEL</span>
                            <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>{salon?.name.toUpperCase()}</h1>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>{Math.round(stats.revenue)} DH</div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>REVENU ESTIMÉ (COMPLÉTÉS & CONFIRMÉS)</span>
                        </div>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '4rem', alignItems: 'start' }}>

                    {/* Sidebar Tabs */}
                    <div style={{ position: 'sticky', top: '120px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {[
                            { id: 'overview', label: 'SYSTÈME D\'ANALYSE' },
                            { id: 'appointments', label: 'RÉSERVATIONS' },
                            { id: 'services', label: 'CATALOGUE SERVICES' },
                            { id: 'staff', label: 'GÉRER L\'ÉQUIPE' },
                            { id: 'settings', label: 'PARAMÈTRES DU SALON' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    textAlign: 'left',
                                    padding: '1.25rem 1.5rem',
                                    background: activeTab === tab.id ? 'var(--text)' : 'transparent',
                                    color: activeTab === tab.id ? 'white' : 'var(--text)',
                                    border: '1px solid',
                                    borderColor: activeTab === tab.id ? 'var(--text)' : 'var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: 800,
                                    fontSize: '0.8rem',
                                    letterSpacing: '0.05em',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div>
                        {activeTab === 'overview' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                <div style={{ padding: '2rem', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>TOTAL RÉSERVATIONS</span>
                                    <p style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem' }}>{stats.totalAppointments}</p>
                                </div>
                                <div style={{ padding: '2rem', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>RÉSERVATIONS EN ATTENTE</span>
                                    <p style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem', color: 'var(--primary)' }}>{stats.pendingAppointments}</p>
                                </div>
                                <div style={{ padding: '2rem', background: 'var(--text)', color: 'white', border: '1px solid var(--text)', borderRadius: 'var(--radius-lg)' }}>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.7, fontWeight: 700, letterSpacing: '0.05em' }}>CHIFFRE D'AFFAIRES (DH)</span>
                                    <p style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem' }}>{Math.round(stats.revenue)}</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'appointments' && (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>GESTION DES RÉSERVATIONS</h2>
                                {appointments.length > 0 ? appointments.map(apt => (
                                    <div key={apt.id} style={{ padding: '2rem', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>STATUT: {apt.status.toUpperCase()}</span>
                                                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.5rem 0' }}>{apt.client.name.toUpperCase()}</h4>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{apt.service.name.toUpperCase()} — {new Date(apt.appointment_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} ({new Date(apt.appointment_time).toLocaleDateString('fr-FR')})</p>
                                                {apt.employee && (
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>PRIS EN CHARGE PAR: {apt.employee.name}</p>
                                                )}
                                                {apt.notes && (
                                                    <p style={{ padding: '0.75rem', background: 'var(--bg)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', marginTop: '1rem', border: '1px solid var(--border)' }}><strong>NOTES:</strong> {apt.notes}</p>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{Math.round(apt.total_price)} DH</div>
                                                {apt.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => updateAppointmentStatus(apt.id, 'confirmed')} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}>ACCEPTER</button>
                                                        <button onClick={() => updateAppointmentStatus(apt.id, 'cancelled')} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', borderColor: '#ef4444', color: '#ef4444' }}>REFUSER</button>
                                                    </>
                                                )}
                                                {apt.status === 'confirmed' && (
                                                    <button onClick={() => updateAppointmentStatus(apt.id, 'completed')} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}>MARQUER TERMINÉ</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <p style={{ padding: '3rem', textAlign: 'center', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>AUCUNE RÉSERVATION ENREGISTRÉE.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'services' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.5rem' }}>CATALOGUE</h2>
                                    <button onClick={() => setShowServiceModal(true)} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.7rem' }}>
                                        + AJOUTER
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {salon?.services?.length > 0 ? salon.services.map(service => (
                                        <div key={service.id} style={{ padding: '1.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                            {service.image_url ? (
                                                <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                                                    <img src={`http://localhost:8000${service.image_url}`} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            ) : (
                                                <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>SANS PHOTO</span>
                                                </div>
                                            )}
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{service.name.toUpperCase()}</h4>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{service.duration_minutes} MIN — {Math.round(service.price)} DH</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text)', marginTop: '0.5rem' }}>{service.description}</p>
                                            </div>
                                            <button style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', padding: '0.5rem' }}>SUPPRIMER</button>
                                        </div>
                                    )) : (
                                        <p style={{ padding: '3rem', textAlign: 'center', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>AUCUN SERVICE CONFIGURÉ.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'staff' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.5rem' }}>L'ÉQUIPE DU SALON</h2>
                                    <button onClick={() => setShowStaffModal(true)} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.7rem' }}>
                                        + AJOUTER
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {salon?.employees?.length > 0 ? salon.employees.map(employee => (
                                        <div key={employee.id} style={{ padding: '1.5rem 2rem', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{employee.name.toUpperCase()}</h4>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginTop: '0.25rem' }}>{employee.role ? employee.role.toUpperCase() : 'MEMBRE'}</p>
                                                {employee.bio && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>"{employee.bio}"</p>}
                                            </div>
                                            <button style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>SUPPRIMER</button>
                                        </div>
                                    )) : (
                                        <p style={{ padding: '3rem', textAlign: 'center', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>AUCUN MEMBRE DANS L'ÉQUIPE.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>PARAMÈTRES DE L'ÉTABLISSEMENT</h2>
                                <div style={{ background: 'white', padding: '3rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
                                    <form onSubmit={updateSalonProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                            <input type="text" placeholder="NOM DU SALON" value={salonPreProfile.name} onChange={(e) => setSalonPreProfile({ ...salonPreProfile, name: e.target.value })} required />
                                            <input type="tel" placeholder="TÉLÉPHONE" value={salonPreProfile.phone} onChange={(e) => setSalonPreProfile({ ...salonPreProfile, phone: e.target.value })} required />
                                        </div>
                                        <input type="text" placeholder="ADRESSE COMPLETE" value={salonPreProfile.address} onChange={(e) => setSalonPreProfile({ ...salonPreProfile, address: e.target.value })} required />
                                        <select value={salonPreProfile.city} onChange={(e) => setSalonPreProfile({ ...salonPreProfile, city: e.target.value })} required style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                                            <option value="Casablanca">CASABLANCA</option>
                                            <option value="Marrakech">MARRAKECH</option>
                                            <option value="Rabat">RABAT</option>
                                        </select>
                                        <textarea placeholder="DESCRIPTION DE L'ÉTABLISSEMENT" value={salonPreProfile.description} onChange={(e) => setSalonPreProfile({ ...salonPreProfile, description: e.target.value })} required style={{ minHeight: '120px', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit' }} />
                                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>METTRE À JOUR LE PROFIL</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showServiceModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: 'var(--bg)', padding: '3rem', borderRadius: 'var(--radius-xl)', maxWidth: '500px', width: '100%', border: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>NOUVEAU SERVICE</h3>
                        <form onSubmit={addService} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <input type="text" placeholder="NOM (EX: COUPE CLASSIQUE)" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} required />
                            <textarea placeholder="DESCRIPTION DU SERVICE" style={{ minHeight: '80px', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit' }} value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input type="number" placeholder="PRIX (DH)" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} required />
                                <input type="number" placeholder="DURÉE (MIN)" value={newService.duration_minutes} onChange={(e) => setNewService({ ...newService, duration_minutes: e.target.value })} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>PHOTO D'ILLUSTRATION (OPTIONNELLE)</label>
                                <input type="file" accept="image/*" onChange={(e) => setServiceImage(e.target.files[0])} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>CRÉER</button>
                                <button type="button" onClick={() => setShowServiceModal(false)} className="btn btn-outline" style={{ flex: 1 }}>ANNULER</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showStaffModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div style={{ background: 'var(--bg)', padding: '3rem', borderRadius: 'var(--radius-xl)', maxWidth: '500px', width: '100%', border: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>AJOUTER UN COLLABORATEUR</h3>
                        <form onSubmit={addStaff} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <input type="text" placeholder="NOM COMPLET" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} required />
                            <input type="text" placeholder="RÔLE (EX: BARBIER EXPERT)" value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })} required />
                            <textarea placeholder="PETITE DESCRIPTION / BIO" style={{ minHeight: '80px', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit' }} value={newStaff.bio} onChange={(e) => setNewStaff({ ...newStaff, bio: e.target.value })} />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>AJOUTER</button>
                                <button type="button" onClick={() => setShowStaffModal(false)} className="btn btn-outline" style={{ flex: 1 }}>ANNULER</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalonDashboard;
