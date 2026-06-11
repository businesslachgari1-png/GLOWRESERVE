// src/config.js
// Centralise l'URL de l'API pour le frontend Vite.
// VITE_API_URL provient du fichier .env (ex: https://glowreserve-production.up.railway.app/api)
// On enlève les slashs finaux éventuels pour éviter les chemins du type "//login".

export const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/,'');
