#!/bin/sh
composer install
docker-compose up --build -d
echo "Aguarde enquanto o db reinicia. Isso levará alguns segundos."
sleep 10
php artisan migrate:refresh
php artisan db:seed --class=CurrencySeeder
rm rr
./vendor/bin/rr get-binary
chmod +x ./rr
