#!/usr/bin/env bash

composer install
php artisan database:wait
php artisan database:testing

echo "Migrate for developement."
php artisan migrate

echo "Migrate for tests."
php artisan migrate --database=mysql_testing

echo "***************************************************"
echo "*                                                 *"
echo "*  Hurb app is fully up on http://localhost:8000  *"
echo "*                                                 *"
echo "***************************************************"
php-fpm