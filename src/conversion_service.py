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
        return [{'currencies': currencies}, 200]

    def get_all_user_created_currencies(self):
        result = self.__reldb_connector.run_select_query(
            'SELECT NAME FROM USER_CURRENCY;')
        return [{'currencies': [entry[0] for entry in result]}, 200]

    # TODO: make query executions parallel
    def get_all_currencies(self):
        [real_currencies, _] = self.get_all_real_currencies()
        [user_created_currencies, _] = self.get_all_user_created_currencies()
        real_currencies['currencies'].extend(
            user_created_currencies['currencies'])
        return [{'currencies': real_currencies['currencies']}, 200]

    def get_by_name_user_created(self, target):
        result = self.__reldb_connector.run_select_query(
            'SELECT NAME, BASE_VALUE FROM USER_CURRENCY WHERE NAME = ?;', [target])
        return [{'result': result}, 200]

    def get_by_name_real_currency(self, target):
        base_value = self.__redis_conn.get(f'{CURRENCY_PREFIX}{target}')
        if(base_value):
            return [{'name': target, 'base_value': float(base_value.decode('utf-8'))}, 200]
        else:
            return [{}, 404]

    def create_currency(self, name, base_value):
        result = self.__reldb_connector.run_insert_or_delete_query('''
            INSERT INTO USER_CURRENCY (NAME, BASE_VALUE)
            VALUES (?,?);
        ''', [name, base_value])
        return [{'success': result}, 200]

    def delete_currency(self, name):
        result = self.__reldb_connector.run_insert_or_delete_query('''
            DELETE FROM USER_CURRENCY WHERE NAME = ?;
        ''', [name])
        return [{'success': result}, 200]

    def update_currency(self, name, new_base_value):
        rows_affected = self.__reldb_connector.run_update_query('''
            UPDATE USER_CURRENCY SET BASE_VALUE = ? WHERE NAME = ?;
        ''', [new_base_value, name])
        return [{'rows_affected': rows_affected}, 200]

    # TODO: add try-except for handling db errors
    def convert(self, currency_from, currency_to, amount):
        # check guards before attempting a conversion from scratch
        amount = float(amount)
        cache_key = f'{currency_from}_{amount}_{currency_to}'
        conversion = self.__guard_conversion(
            currency_from, currency_to, amount, cache_key)
        if(conversion != None):
            return conversion
        # attempt conversion from scratch
        from_rate = self.__get_rate(currency_from)
        to_rate = self.__get_rate(currency_to)
        if(not from_rate or not to_rate):
            return [{'conversion':  "One of the currencies provided was not found. Double check your currencies and try again."}, 404]
        # cache the conversion results
        conversion = self.__calculate_conversion(to_rate, from_rate, amount)
        self.__redis_conn.setex(cache_key, 120, conversion)
        # return conversion result
        return [{'conversion': conversion}, 200]

    def __guard_conversion(self, currency_from, currency_to, amount, cache_key):
        # guard: amount must be valid
        if(amount <= 0.0):
            return [{'conversion': 'Amount must be higher than zero!'}, 400]
        # guard: conversion currencies must be different
        if(currency_from == currency_to):
            return [{'conversion': amount}, 200]
        # guard: check cache for this conversion and return it if found
        cached_conversion = self.__redis_conn.get(cache_key)
        if(cached_conversion):
            return [{'conversion': float(cached_conversion.decode('utf-8'))}, 200]
        # return none if all guards passed
        return None

    def __get_rate(self, currency):
        try:
            rate = self.__redis_conn.get(f'{CURRENCY_PREFIX}{currency}')
            if(not rate):
                [result, _] = self.get_by_name_user_created(currency)
                rate = result['result'][0][1]
            return rate
        except IndexError:
            return None

    def __calculate_conversion(self, to_rate, from_rate, amount):
        if(type(to_rate).__name__ == 'bytes'):
            to_rate = to_rate.decode('utf-8')
        if(type(from_rate).__name__ == 'bytes'):
            from_rate = from_rate.decode('utf-8')
        return round((float(to_rate)/float(from_rate)) * amount, 2)

    def __del__(self):
        self.__redis_conn = None
        self.__reldb_connector = None
