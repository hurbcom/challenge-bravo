#!/bin/sh

cp -u ./.env.example ./.env

php artisan key:generate

exec "$@"