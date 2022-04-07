#!/bin/bash
touch database/database.sqlite
chown 1000:1000 database/database.sqlite
chmod 766 database/database.sqlite
redis-server --daemonize yes
php artisan migrate --seed
php -S lumen:8000 -t public
echo 'Done!'
