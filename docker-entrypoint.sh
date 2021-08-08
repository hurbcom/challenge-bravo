#!/bin/bash
set -e

DATA_HORA_INICIO=$(date)
echo "\33[31m==========================================\33[39m"
echo "\33[31mData e hora do inicio do docker-entrypoint\33[39m"
echo "$DATA_HORA_INICIO"
echo "\33[31m==========================================\33[39m"

# printenv
source venv/bin/activate

echo "\33[31m...Inicializando servidor de aplicação...\33[39m"
python3 api/manage.py runserver 0.0.0.0:8008
