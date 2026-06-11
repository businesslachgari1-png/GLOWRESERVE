#!/bin/bash

# Ensure storage directory has correct permissions
chmod -R 775 storage bootstrap/cache

# Create symlink for user-uploaded assets/images
php artisan storage:link --force

# Run database migrations
php artisan migrate --force

# Start Nginx & PHP-FPM (standard Nixpacks PHP environment servers)
php-fpm -D && nginx -g 'daemon off;'
