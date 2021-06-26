#!/bin/sh

mkdir -p ./docker/redis
mkdir -p ./docker/mysql

cp -u .env.example .env

php artisan key:generate
php artisan migrate

exec "$@"