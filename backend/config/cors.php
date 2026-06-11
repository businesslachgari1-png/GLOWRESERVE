<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    // Restrict to the specific front‑end origin
    'allowed_origins' => ['https://vigilant-blessing-production-3278.up.railway.app'],
    // Keep other headers open
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
