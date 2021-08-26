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

    def run_select_query(self, query, params=[]):
        cursor = self.__conn.cursor()
        cursor.execute(query, params)
        self.__conn.commit()
        result = cursor.fetchall()
        cursor.close()
        return result

    def run_insert_or_delete_query(self, query, params):
        if(not self.__check_params(params)):
            return [{'success': False, 'error': 'One or more parameters were invalid or blank.'}, 400]
        cursor = self.__conn.cursor()
        cursor.execute(query, params)
        self.__conn.commit()
        cursor.close()
        return [{'success': True}, 200]

    def run_update_query(self, query, params):
        if(not self.__check_params(params)):
            return [{'rows_affected': 0, 'error': 'One or more parameters were invalid or blank.'}, 400]
        cursor = self.__conn.cursor()
        cursor.execute(query, params)
        self.__conn.commit()
        rows_affected = cursor.rowcount
        cursor.close()
        return [{'rows_affected': rows_affected}, 200]

    def __check_params(self, params):
        for param in params:
            if(type(param).__name__ == 'str'):
                if(len(param) == 0):
                    return False
            elif(type(param).__name__ == 'float'):
                if(param <= 0.0):
                    return False
            else:
                return False
        return True

    def __del__(self):
        self.__conn.close()
