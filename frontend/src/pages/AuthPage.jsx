import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'client'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        let result;
        if (isLogin) {
            result = await login(formData.email, formData.password);
        } else {
            if (formData.password !== formData.password_confirmation) {
                setErrors({ password_confirmation: ['Les mots de passe ne correspondent pas'] });
                setLoading(false);
                return;
            }
            result = await register(
                formData.name,
                formData.email,
                formData.password,
                formData.password_confirmation,
                formData.role
            );
        }

        if (result && result.success) {
            if (result.user?.role === 'owner') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } else if (result && result.errors) {
            setErrors(result.errors);
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '2rem' }}>
            <div style={{ width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <Link to="/" style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)', display: 'block', marginBottom: '2rem' }}>GLOWRESERVE</Link>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{isLogin ? 'BONRETOUR.' : 'BIENVENUE.'}</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {isLogin ? 'Accédez à votre espace membre.' : 'Créez votre compte en quelques instants.'}
                    </p>
                </div>

                <div style={{ background: 'white', padding: '3rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {!isLogin && (
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.1em' }}>NOM COMPLET</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="VOTRE NOM"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{ width: '100%' }}
                                    required
                                />
                                {errors.name && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem' }}>{errors.name[0]}</p>}
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.1em' }}>EMAIL</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="VOTRE@EMAIL.COM"
                                value={formData.email}
                                onChange={handleChange}
                                style={{ width: '100%' }}
                                required
                            />
                            {errors.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem' }}>{errors.email[0]}</p>}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.1em' }}>MOT DE PASSE</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                style={{ width: '100%' }}
                                required
                            />
                            {errors.password && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem' }}>{errors.password[0]}</p>}
                        </div>

                        {!isLogin && (
                            <>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.1em' }}>CONFIRMER LE MOT DE PASSE</label>
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        placeholder="••••••••"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.1em' }}>VOUS ÊTES</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="client">CLIENT</option>
                                        <option value="owner">PROPRIÉTAIRE DE SALON</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                            {loading ? 'CHARGEMENT...' : (isLogin ? 'SE CONNECTER' : 'CRÉER UN COMPTE')}
                        </button>
                    </form>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center', paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {isLogin ? "PAS ENCORE DE COMPTE ?" : "DÉJÀ UN COMPTE ?"}
                        </p>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem', marginTop: '0.5rem', letterSpacing: '0.1em' }}
                        >
                            {isLogin ? 'REJOINDRE LE CERCLE' : 'SE CONNECTER'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
