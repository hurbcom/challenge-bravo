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

    # TODO: add try-except structure for handling db errors
    def run_select_query(self, query, params=[]):
        cursor = self.__conn.cursor()
        cursor.execute(query, params)
        self.__conn.commit()
        result = cursor.fetchall()
        cursor.close()
        return result

    # TODO: add guard clauses for empty params
    # TODO: add try-except structure for handling db errors
    def run_insert_or_delete_query(self, query, params):
        cursor = self.__conn.cursor()
        cursor.execute(query, params)
        self.__conn.commit()
        cursor.close()
        return True

    # TODO: add guard clauses for empty params
    # TODO: add try-except structure for handling db errors
    def run_update_query(self, query, params):
        cursor = self.__conn.cursor()
        cursor.execute(query, params)
        self.__conn.commit()
        rows_affected = cursor.rowcount
        cursor.close()
        return rows_affected

    def __del__(self):
        self.__conn.close()
