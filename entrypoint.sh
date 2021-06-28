#!/bin/sh

composer install --no-dev --prefer-dist --optimize-autoloader && composer clear-cache

cp -u ./.env.example ./.env

php artisan key:generate

exec "$@"