import peewee

from decouple import config

DB_NAME = config('DB_NAME')

db_instance = peewee.SqliteDatabase(DB_NAME)
