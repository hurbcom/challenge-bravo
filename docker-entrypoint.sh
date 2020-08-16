#!/bin/sh 

set -e

function db_ready(){
python << END
import sys
import sqlalchemy

try:
    engine_pro = sqlalchemy.create_engine('${DATABASE_URL}').connect()
except (sqlalchemy.exc.SQLAlchemyError, sqlalchemy.exc.DBAPIError) as e:
    print('Error:', e)
    sys.exit(-1)
sys.exit(0)
END
}

until db_ready; do
  >&2 echo 'Waiting for database to become available...'
  sleep 1
done
>&2 echo 'Database is available'

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
exec "$@"