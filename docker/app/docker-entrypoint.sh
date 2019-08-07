#!/bin/bash
if [ ! "$(ls -A)" ]
then
  cd ..
  composer create-project laravel/laravel html
  cd html
else
  composer install
fi

if [ ! -e .env ] && [ -e .env.example ]
then
  envsubst < .env.example > .env
  php artisan key:generate
fi

php-fpm