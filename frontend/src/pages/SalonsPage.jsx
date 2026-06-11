import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const SalonsPage = () => {
    const [salons, setSalons] = useState([]);
    const [filteredSalons, setFilteredSalons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSalons();
    }, []);

    useEffect(() => {
        filterSalons();
    }, [searchTerm, cityFilter, salons]);

    const fetchSalons = async () => {
        try {
            const response = await fetch(`${API_URL}/salons`);
            const result = await response.json();
            const salonsList = result.data || [];
            setSalons(salonsList);
            setFilteredSalons(salonsList);
        } catch (error) {
            console.error('Error:', error);
            setSalons([]);
            setFilteredSalons([]);
        } finally {
            setLoading(false);
        }
    };

    const filterSalons = () => {
        let filtered = salons;
        if (searchTerm) {
            filtered = filtered.filter(salon =>
                salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                salon.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (cityFilter) {
            filtered = filtered.filter(salon =>
                salon.city.toLowerCase().includes(cityFilter.toLowerCase())
            );
        }
        setFilteredSalons(filtered);
    };

    if (loading) {
        return <div style={{ padding: '10rem 2rem', textAlign: 'center', fontWeight: 600 }}>CHARGEMENT...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: '10rem', paddingBottom: '6rem' }}>
            <div className="container">
                {/* Header */}
                <div style={{ marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>NOS SALONS</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                        {filteredSalons.length} établissement{filteredSalons.length > 1 ? 's' : ''} d'exception.
                    </p>
                </div>

                {/* Filters */}
                <div style={{
                    padding: '1.5rem',
                    background: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '4rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <input
                            type="text"
                            placeholder="RECHERCHER..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                        />
                    </div>
                    <div style={{ minWidth: '150px' }}>
                        <select
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                        >
                            <option value="">TOUTES LES VILLES</option>
                            <option value="Casablanca">CASABLANCA</option>
                            <option value="Marrakech">MARRAKECH</option>
                            <option value="Rabat">RABAT</option>
                        </select>
                    </div>
                </div>

                {/* Grid */}
                {filteredSalons.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {filteredSalons.map((salon) => (
                            <Link to={`/salons/${salon.slug}`} key={salon.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    background: 'white',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    transition: 'var(--transition)'
                                }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                                    <div style={{ height: '220px', overflow: 'hidden' }}>
                                        <img
                                            src={salon.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800'}
                                            alt={salon.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{salon.name}</h3>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em' }}>{salon.city.toUpperCase()}</span>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', height: '2.5rem', overflow: 'hidden', marginBottom: '1rem' }}>
                                            {salon.description}
                                        </p>
                                        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>VOIR DÉTAILS</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>MÉMOIRE DU SALON</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '10rem 0' }}>
                        <p style={{ color: 'var(--text-muted)' }}>AUCUN SALON TROUVÉ POUR VOTRE RECHERCHE.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalonsPage;
