import sqlite3
import os
import time

class Connector(object):

    def __init__(self):
        self.db_name = f"database/{os.getenv('DB_NAME')}"

    def selectOne(self, query):
        connection = sqlite3.connect(self.db_name)
        cursor = connection.cursor()
        cursor.execute(query)
        return cursor.fetchone()
