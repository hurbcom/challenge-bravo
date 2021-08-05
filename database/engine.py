import sqlite3
import os
import time
from database.sharedConnector import db


class Connector(object):

    def __init__(self):
        db.drop_all()
        db.create_all()
        self.db_name = os.path.abspath(f"database/{os.getenv('DB_NAME')}")


    def selectOne(self, query):
        connection = sqlite3.connect(self.db_name)
        cursor = connection.cursor()
        cursor.execute(query)
        return cursor.fetchone()

