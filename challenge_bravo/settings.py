import os
import peewee

from decouple import config


TEST_ENV = config('TEST_ENV', cast=bool)

if TEST_ENV is True:
    # Make sure that every test run is made with a clean sqlite database
    test_db_path = 'challenge-bravo.db'
    if os.path.exists(test_db_path):
        os.remove(test_db_path)
    db_instance = peewee.SqliteDatabase(test_db_path)
else:
    PSQL_HOST = config('PSQL_HOST')
    PSQL_PORT = config('PSQL_PORT')
    PSQL_USER = config('PSQL_USER')
    PSQL_PASSWORD = config('PSQL_PASSWORD')
    PSQL_DB_NAME = config('PSQL_DB_NAME')

    db_instance = peewee.PostgresqlDatabase(
        database=PSQL_DB_NAME, host=PSQL_HOST, port=PSQL_PORT,
        user=PSQL_USER, password=PSQL_PASSWORD)

PROJECT_FOLDER = os.path.abspath('.')
FIXTURES_FOLDER = PROJECT_FOLDER + '/fixtures/'
