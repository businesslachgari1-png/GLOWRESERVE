import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { setToken, setUser } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const error = params.get('message');

        if (token) {
            localStorage.setItem('auth_token', token);
            // Redirect to home or dashboard
            window.location.href = '/';
        } else if (error) {
            alert('Erreur d\'authentification: ' + error);
            navigate('/auth');
        }
    }, [navigate]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="loader" style={{ margin: '0 auto 1rem' }}></div>
                <p style={{ color: 'var(--text-muted)' }}>Authentification en cours...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
