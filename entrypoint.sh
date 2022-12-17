#!/bin/sh

# Runs migrations
python manage.py migrate

# Load initial data
python manage.py loaddata exchange/core/fixtures/currencies.json

exec "$@"
