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
        result = {'currencies': [entry[0] for entry in cursor.fetchall()]}
        cursor.close()
        return result

    def get_all_currencies(self):
        # TODO: make query executions parallel
        real_currencies = self.get_all_real_currencies()
        user_created_currencies = self.get_all_user_created_currencies()
        real_currencies['currencies'].extend(
            user_created_currencies['currencies'])
        return {'currencies': real_currencies['currencies']}

    def get_by_name_user_created(self, target):
        cursor = self.__reldb_conn.cursor()
        cursor.execute(
            'SELECT NAME, BASE_VALUE FROM USER_CURRENCY WHERE NAME = ?;', [target])
        self.__reldb_conn.commit()
        result = {'result': cursor.fetchall()}
        cursor.close()
        return result

    def get_by_name_real_currency(self, target):
        # 'curr_' is used in redis cache to diferentiate between a real currency
        # from a cached convertion operation e.g.: 'BRL1500.0USD' (from+amount+to)
        base_value = self.__redis_conn.get(f'curr_{target}')
        if(base_value):
            return {'name': target, 'base_value': float(base_value.decode('utf-8'))}
        else:
            return {}

    # TODO: add guard clauses for empty args
    # TODO: add try-except structure for handling db errors
    def create_currency(self, name, base_value):
        cursor = self.__reldb_conn.cursor()
        cursor.execute('''
            INSERT INTO USER_CURRENCY (NAME, BASE_VALUE)
            VALUES (?,?);
        ''', [name, base_value])
        self.__reldb_conn.commit()
        cursor.close()
        return True

    # TODO: add guard clauses for empty args
    # TODO: add try-except structure for handling db errors
    def delete_currency(self, name):
        cursor = self.__reldb_conn.cursor()
        cursor.execute('''
            DELETE FROM USER_CURRENCY WHERE NAME = ?;
        ''', [name])
        self.__reldb_conn.commit()
        return True

    # TODO: add guard clauses for empty args
    # TODO: add try-except structure for handling db errors
    def update_currency(self, name, new_base_value):
        cursor = self.__reldb_conn.cursor()
        cursor.execute('''
            UPDATE USER_CURRENCY SET BASE_VALUE = ? WHERE NAME = ?;
        ''', [new_base_value, name])
        self.__reldb_conn.commit()
        rows_affected = cursor.rowcount
        cursor.close()
        return {'rows_affected': rows_affected}

    # TODO: add guard clauses for empty args
    # TODO: add try-except structure for handling db errors
    def convert(self, currency_from, currency_to, amount):
        cached_conversion = self.__redis_conn.get(
            f'{currency_from}_{amount}_{currency_to}')

        if(cached_conversion):
            print(
                f'Cached conversion found for {currency_from}_{amount}_{currency_to}. Returning cached value.')
            return {'conversion': float(cached_conversion.decode('utf-8'))}

        from_rate = self.__redis_conn.get(f'curr_{currency_from}')
        to_rate = self.__redis_conn.get(f'curr_{currency_to}')

        if(not from_rate):
            from_rate = self.get_by_name_user_created(currency_from)[
                'result'][0][1]

        if(not to_rate):
            to_rate = self.get_by_name_user_created(currency_to)[
                'result'][0][1]

        conversion = self.__calculate_conversion(to_rate, from_rate, amount)
        self.__redis_conn.setex(
            f'{currency_from}_{amount}_{currency_to}', 120, conversion)

        return {'conversion': conversion}

    def __calculate_conversion(self, to_rate, from_rate, amount):
        if(type(to_rate).__name__ != 'float'):
            to_rate = float(to_rate.decode('utf-8'))
        if(type(from_rate).__name__ != 'float'):
            from_rate = float(from_rate.decode('utf-8'))
        return round((to_rate/from_rate) * amount, 2)

    def __del__(self):
        self.__redis_connector = None
        self.__redis_conn = None
        self.__reldb_connector = None
        self.__reldb_conn = None
