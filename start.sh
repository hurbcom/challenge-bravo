#!/usr/bin/env bash

python manage.py migrate;
python manage.py loaddata loadinitial.json;
python manage.py runserver;
