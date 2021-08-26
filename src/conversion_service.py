from src.redis_connector import RedisConnector
from src.reldb_connector import RelationalDBConnector

# 'curr_' is used in redis cache to diferentiate between a real currency
# from a cached conversion operation e.g.: 'BRL_1500.0_USD' (from+amount+to)
CURRENCY_PREFIX = 'curr_'


class ConversionService:
    def __init__(self):
        self.__redis_conn = RedisConnector().get_connection()
        self.__reldb_connector = RelationalDBConnector()

    def get_all_real_currencies(self):
        currencies = [currency.decode('utf-8').replace(CURRENCY_PREFIX, '')
                      for currency in self.__redis_conn.scan_iter(f'{CURRENCY_PREFIX}*')]
        return {'currencies': currencies}

    def get_all_user_created_currencies(self):
        result = self.__reldb_connector.run_select_query(
            'SELECT NAME FROM USER_CURRENCY;')
        return {'currencies': [entry[0] for entry in result]}

    # TODO: make query executions parallel
    def get_all_currencies(self):
        real_currencies = self.get_all_real_currencies()
        user_created_currencies = self.get_all_user_created_currencies()
        real_currencies['currencies'].extend(
            user_created_currencies['currencies'])
        return {'currencies': real_currencies['currencies']}

    def get_by_name_user_created(self, target):
        result = self.__reldb_connector.run_select_query(
            'SELECT NAME, BASE_VALUE FROM USER_CURRENCY WHERE NAME = ?;', [target])
        return {'result': result}

    def get_by_name_real_currency(self, target):
        base_value = self.__redis_conn.get(f'{CURRENCY_PREFIX}{target}')
        if(base_value):
            return {'name': target, 'base_value': float(base_value.decode('utf-8'))}
        else:
            return {}

    def create_currency(self, name, base_value):
        result = self.__reldb_connector.run_insert_or_delete_query('''
            INSERT INTO USER_CURRENCY (NAME, BASE_VALUE)
            VALUES (?,?);
        ''', [name, base_value])
        return result

    def delete_currency(self, name):
        result = self.__reldb_connector.run_insert_or_delete_query('''
            DELETE FROM USER_CURRENCY WHERE NAME = ?;
        ''', [name])
        return result

    def update_currency(self, name, new_base_value):
        rows_affected = self.__reldb_connector.run_update_query('''
            UPDATE USER_CURRENCY SET BASE_VALUE = ? WHERE NAME = ?;
        ''', [new_base_value, name])
        return {'rows_affected': rows_affected}

    # TODO: add guard clauses for checking the args
    # TODO: add try-except for handling db errors
    def convert(self, currency_from, currency_to, amount):
        amount = float(amount)
        if(currency_from == currency_to):
            return {'conversion': amount}

        cache_key = f'{currency_from}_{amount}_{currency_to}'
        cached_conversion = self.__redis_conn.get(cache_key)
        if(cached_conversion):
            return {'conversion': float(cached_conversion.decode('utf-8'))}

        [from_rate, to_rate] = self.__get_rates(currency_from, currency_to)
        conversion = self.__calculate_conversion(to_rate, from_rate, amount)
        self.__redis_conn.setex(cache_key, 120, conversion)

        return {'conversion': conversion}

    def __get_rates(self, currency_from, currency_to):
        from_rate = self.__redis_conn.get(f'{CURRENCY_PREFIX}{currency_from}')
        to_rate = self.__redis_conn.get(f'{CURRENCY_PREFIX}{currency_to}')
        if(not from_rate):
            from_rate = self.get_by_name_user_created(currency_from)[
                'result'][0][1]
        if(not to_rate):
            to_rate = self.get_by_name_user_created(currency_to)[
                'result'][0][1]
        return [from_rate, to_rate]

    def __calculate_conversion(self, to_rate, from_rate, amount):
        if(type(to_rate).__name__ == 'bytes'):
            to_rate = to_rate.decode('utf-8')
        if(type(from_rate).__name__ == 'bytes'):
            from_rate = from_rate.decode('utf-8')
        return round((float(to_rate)/float(from_rate)) * amount, 2)

    def __del__(self):
        self.__redis_conn = None
        self.__reldb_connector = None
