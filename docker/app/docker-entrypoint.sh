#!/bin/bash
if [ ! -e .env ] && [ -e .env.example ]
then
  envsubst < .env.example > .env
  php artisan key:generate
fi

chmod -R 755 storage

php-fpm