import _thread
from src.redis_connector import RedisConnector
from src.reldb_connector import RelationalDBConnector


class ConvertionService:
    def __init__(self):
        self.__redis_connector = RedisConnector()
        self.__redis_conn = self.__redis_connector.get_connection()
        self.__reldb_connector = RelationalDBConnector()
        self.__reldb_conn = self.__reldb_connector.get_connection()

    def get_all_real_currencies(self):
        return_dict = {'currencies': []}
        for currency in self.__redis_conn.scan_iter('curr_*'):
            return_dict['currencies'].append(
                currency.decode('utf-8').replace('curr_', ''))
        return return_dict

    def get_all_user_created_currencies(self):
        cursor = self.__reldb_conn.cursor()
        cursor.execute('SELECT NAME FROM USER_CURRENCY;')
        return {'currencies': [entry[0] for entry in cursor.fetchall()]}

    def get_all_currencies(self):
        # TODO: make query executions parallel
        real_currencies = self.get_all_real_currencies()
        user_created_currencies = self.get_all_user_created_currencies()
        real_currencies['currencies'].extend(
            user_created_currencies['currencies'])
        return {'currencies': real_currencies['currencies']}

    def __del__(self):
        self.__redis_connector = None
        self.__redis_conn = None
        self.__reldb_connector = None
        self.__reldb_conn = None
