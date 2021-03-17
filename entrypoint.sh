#!/bin/sh

sleep 30

python manage.py migrate --noinput

python manage.py loaddata moedas.json
exec "$@"