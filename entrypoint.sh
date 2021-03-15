#!/bin/sh
python manage.py migrate --noinput
python manage.py loaddata moedas.json
exec "$@"