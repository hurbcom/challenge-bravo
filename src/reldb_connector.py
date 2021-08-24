import sqlite3

PREFIX = '[RELDB CONNECTOR]'


class RelationalDBConnector:
    def __init__(self):
        self.__conn = sqlite3.connect('reldb.db')
        self.__conn.cursor().execute('''
            CREATE TABLE IF NOT EXISTS USER_CURRENCY(
                NAME VARCHAR(16) NOT NULL,
                BASE_VALUE FLOAT NOT NULL,
                UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY(NAME)
            )
        ''')

    def get_connection(self):
        return self.__conn

    def __del__(self):
        self.__conn.close()
