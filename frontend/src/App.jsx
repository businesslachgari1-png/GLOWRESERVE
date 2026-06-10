import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import AuthCallback from './pages/AuthCallback';
import SalonsPage from './pages/SalonsPage';
import SalonDetailPage from './pages/SalonDetailPage';
import BookingPage from './pages/BookingPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import SalonDashboard from './pages/SalonDashboard';

const HomePage = () => {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="app-wrapper">
            {/* Navigation */}
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{
                height: 'var(--nav-height)',
                display: 'flex',
                alignItems: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                transition: 'var(--transition)'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)' }}>GLOWRESERVE</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hide-mobile" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <Link to="/" style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text)' }}>ACCUEIL</Link>
                            <Link to="/salons" style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text)' }}>SALONS</Link>
                            {user && user.role === 'client' && <Link to="/my-appointments" style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em' }}>MES RDV</Link>}
                            {user && user.role === 'owner' && <Link to="/dashboard" style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em' }}>TABLEAU DE BORD</Link>}
                        </div>

                        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>

                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            {user ? (
                                <>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
                                    <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DÉCONNEXION</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/auth" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>CONNEXION</Link>
                                    <Link to="/auth" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>REJOINDRE</Link>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        className="hide-desktop"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                        {mobileMenuOpen ? 'FERMER' : 'MENU'}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div style={{ position: 'absolute', top: 'var(--nav-height)', left: 0, right: 0, background: 'white', padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700 }}>ACCUEIL</Link>
                        <Link to="/salons" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700 }}>SALONS</Link>
                        {user && user.role === 'client' && <Link to="/my-appointments" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700 }}>MES RDV</Link>}
                        {user && user.role === 'owner' && <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700 }}>TABLEAU DE BORD</Link>}
                        {user ? (
                            <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', fontWeight: 700 }}>DÉCONNEXION</button>
                        ) : (
                            <Link to="/auth" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700 }}>CONNEXION / REJOINDRE</Link>
                        )}
                    </div>
                )}
            </nav>

            <main>
                {/* Hero */}
                <section className="hero-padding" style={{ textAlign: 'center' }}>
                    <div className="container">
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <span style={{ display: 'block', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: '1.5rem' }}>PRESTIGE & BEAUTÉ</span>
                            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', color: 'var(--text)' }}>
                                L'EXCELLENCE DE LA <br />
                                BEAUTÉ AU MAROC.
                            </h1>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
                                Découvrez et réservez les meilleurs établissements de Casablanca, <br className="hide-mobile" />
                                Marrakech et Rabat en un instant.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <Link to="/salons" className="btn btn-primary">EXPLORER LES SALONS</Link>
                                <Link to="/auth" className="btn btn-outline">REJOINDRE LE CERCLE</Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories - Refined */}
                <section className="section-padding" style={{ background: 'white' }}>
                    <div className="container">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {[
                                { name: 'COIFFURE', count: '45 SALONS' },
                                { name: 'HAMMAM & SPA', count: '32 SALONS' },
                                { name: 'ESTHÉTIQUE', count: '28 SALONS' },
                                { name: 'BARBIER', count: '15 SALONS' },
                                { name: 'ONGLES', count: '22 SALONS' }
                            ].map((cat, i) => (
                                <div key={i} style={{
                                    padding: '2rem 1rem',
                                    textAlign: 'center',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    transition: 'var(--transition)',
                                    cursor: 'pointer'
                                }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                                    <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 800 }}>{cat.name}</h3>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{cat.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured - More subtle */}
                <section className="section-padding">
                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                            <div>
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>LES SALONS À LA UNE</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Notre sélection exclusive du moment</p>
                            </div>
                            <Link to="/salons" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em' }}>VOIR TOUT</Link>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                            {[
                                { name: "RIAD DE BEAUTÉ", city: 'CASABLANCA', price: '250 DH', img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800' },
                                { name: 'ESPACE MAJORELLE', city: 'MARRAKECH', price: '300 DH', img: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800' }
                            ].map((salon, i) => (
                                <Link to="/salons" key={i} style={{ group: 'true' }}>
                                    <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-xl)', background: 'white', border: '1px solid var(--border)' }}>
                                        <div style={{ height: '280px', overflow: 'hidden' }}>
                                            <img src={salon.img} alt={salon.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }}
                                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'} />
                                        </div>
                                        <div style={{ padding: '2rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                <h3 style={{ fontSize: '1.2rem' }}>{salon.name}</h3>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)' }}>{salon.city}</span>
                                            </div>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>À partir de {salon.price}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats / Trust - Simplified */}
                <section className="section-padding" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <div className="container">
                        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '3rem' }}>
                            {[
                                { val: '150+', label: 'SALONS PARTENAIRES' },
                                { val: '12K+', label: 'CLIENTS SATISFAITS' },
                                { val: '4.9/5', label: 'NOTE MOYENNE' }
                            ].map((stat, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>{stat.val}</div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA - More Elegant */}
                <section className="section-padding">
                    <div className="container">
                        <div style={{
                            background: 'var(--text)',
                            color: 'white',
                            padding: '4rem',
                            borderRadius: 'var(--radius-xl)',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white' }}>PRÊT À RÉVÉLER VOTRE ÉCLAT ?</h2>
                                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                                    Rejoignez GLOWRESERVE aujourd'hui et accédez à une sélection exclusive <br className="hide-mobile" />
                                    des meilleurs professionnels du Royaume.
                                </p>
                                <Link to="/auth" className="btn btn-primary">CRÉER UN COMPTE</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Compact */}
            <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border)', background: 'white' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '3rem' }}>
                        <div style={{ flex: '1', minWidth: '250px' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: 900, display: 'block', marginBottom: '1rem' }}>GLOWRESERVE</span>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                                L'excellence de la réservation beauté au Maroc.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '4rem' }}>
                            <div>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '0.1em' }}>PLATEFORME</h4>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                                    <li><Link to="/salons">Explorer les salons</Link></li>
                                    <li><Link to="/auth">Nous rejoindre</Link></li>
                                    <li><a href="#">À propos</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '0.1em' }}>RESEAUX</h4>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                                    <li><a href="#">Instagram</a></li>
                                    <li><a href="#">Facebook</a></li>
                                    <li><a href="#">LinkedIn</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        <span>© 2024 GLOWRESERVE. TOUS DROITS RÉSERVÉS.</span>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <a href="#">CGU</a>
                            <a href="#">CONFIDENTIALITÉ</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/salons" element={<SalonsPage />} />
                    <Route path="/salons/:slug" element={<SalonDetailPage />} />
                    <Route path="/booking/:slug" element={<BookingPage />} />
                    <Route path="/my-appointments" element={<MyAppointmentsPage />} />
                    <Route path="/dashboard" element={<SalonDashboard />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
