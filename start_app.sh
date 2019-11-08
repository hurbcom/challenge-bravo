#!/usr/bin/env bash

composer install
php artisan database:wait
php artisan migrate

echo "***************************************************"
echo "*                                                 *"
echo "*  Hurb app is fully up on http://localhost:8000  *"
echo "*                                                 *"
echo "***************************************************"
php-fpm