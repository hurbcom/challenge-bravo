#!/bin/sh 
lines=$(find migrations/ | wc -l)

if [ $lines -eq 0 ]; then
    echo "Starting Migrate"
    flask db init;
    flask db migrate;  
    flask db upgrade; 
    flask seed;
fi

echo "Starting server"
gunicorn -w 4 --bind 0.0.0.0:5000 wsgi:application;