#!/bin/bash -x

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
flask db init;
flask db migrate;  
flask db upgrade; 
flask seed;
echo "Starting server"
gunicorn -w 1 --bind 0.0.0.0:5000 wsgi:application;

exec "$@"
