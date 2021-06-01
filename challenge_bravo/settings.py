import os
import peewee

from decouple import config

DB_NAME = config('DB_NAME')

db_instance = peewee.SqliteDatabase(DB_NAME)

PROJECT_FOLDER = os.path.abspath('.')
FIXTURES_FOLDER = PROJECT_FOLDER + '/fixtures/'
