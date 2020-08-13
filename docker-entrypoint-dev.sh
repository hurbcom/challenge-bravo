#!/bin/bash -x
echo "Starting Migrate"
flask db init;
flask db migrate;  
flask db upgrade; 
flask seed;
echo "Starting server"
gunicorn -w 1 --bind 0.0.0.0:5000 wsgi:application;