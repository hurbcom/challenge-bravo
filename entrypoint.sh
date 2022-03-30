#!/bin/bash
touch database/database.sqlite
php artisan migrate
php -S lumen:8000 -t public
echo 'Done!'
