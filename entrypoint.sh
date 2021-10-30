#!/bin/sh

alembic upgrade head
python /code/app/initial_data.py
exec "$@"