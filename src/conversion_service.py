from src.redis_connector import RedisConnector
from src.reldb_connector import RelationalDBConnector

# 'curr_' is used in redis cache to diferentiate between a real currency
# from a cached conversion operation e.g.: 'BRL_1500.0_USD' (from+amount+to)
CURRENCY_PREFIX = 'curr_'
PREFIX = '[CONVERSION SERVICE]'
ERROR_OBJ = [
    {'error': 'An internal error occurred, please contact support for advice.'}, 500]


class ConversionService:
    def __init__(self):
        self.__redis_conn = RedisConnector().get_connection()
        self.__reldb_connector = RelationalDBConnector()

    def get_all_real_currencies(self):
        try:
            currencies = [currency.decode('utf-8').replace(CURRENCY_PREFIX, '')
                          for currency in self.__redis_conn.scan_iter(f'{CURRENCY_PREFIX}*')]
            return [{'currencies': currencies}, 200]
        except Exception as e:
            print(f'{PREFIX} - Internal error occurred: {e}')
            return ERROR_OBJ

    def get_all_user_created_currencies(self):
        try:
            result = self.__reldb_connector.run_select_query(
                'SELECT NAME FROM USER_CURRENCY;')
            return [{'currencies': [entry[0] for entry in result]}, 200]
        except Exception as e:
            print(f'{PREFIX} - Internal error occurred: {e}')
            return ERROR_OBJ

    # TODO: make query executions parallel
    def get_all_currencies(self):
        try:
            [real_currencies, _] = self.get_all_real_currencies()
            [user_created_currencies, _] = self.get_all_user_created_currencies()
            real_currencies['currencies'].extend(
                user_created_currencies['currencies'])
            return [{'currencies': real_currencies['currencies']}, 200]
        except Exception as e:
            print(f'{PREFIX} - Internal error occurred: {e}')
            return ERROR_OBJ

    def get_by_name_user_created(self, target):
        try:
            result = self.__reldb_connector.run_select_query(
                'SELECT NAME, BASE_VALUE FROM USER_CURRENCY WHERE NAME = ?;', [target])
            return [{'result': result}, 200]
        except Exception as e:
            print(f'{PREFIX} - Internal error occurred: {e}')
            return ERROR_OBJ

    def get_by_name_real_currency(self, target):
        try:
            base_value = self.__redis_conn.get(f'{CURRENCY_PREFIX}{target}')
            if(base_value):
                return [{'name': target, 'base_value': float(base_value.decode('utf-8'))}, 200]
            else:
                return [{}, 404]
        except Exception as e:
            print(f'{PREFIX} - Internal error occurred: {e}')
            return ERROR_OBJ

    def create_currency(self, name, base_value):
        try:
            result = self.__reldb_connector.run_insert_or_delete_query('''
                INSERT INTO USER_CURRENCY (NAME, BASE_VALUE)
                VALUES (?,?);
            ''', [name, base_value])
            return result
        except Exception as e:
            print(f'{PREFIX} - Internal error occurred: {e}')
            return ERROR_OBJ

    def delete_currency(self, name):
        try:
            result = self.__reldb_connector.run_insert_or_delete_query('''
                DELETE FROM USER_CURRENCY WHERE NAME = ?;
            ''', [name])
            return result
        except Exception as e:
            print(f'{PREFIX} - Internal error occurred: {e}')
            return ERROR_OBJ

    def update_currency(self, name, new_base_value):
        try:
            result = self.__reldb_connector.run_update_query('''
                UPDATE USER_CURRENCY SET BASE_VALUE = ? WHERE NAME = ?;
            ''', [new_base_value, name])
            return result
        except Exception as e:
            print(f'{PREFIX} - Internal error occurred: {e}')
            return ERROR_OBJ

    def convert(self, currency_from, currency_to, amount):
        try:
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
            conversion = self.__calculate_conversion(
                to_rate, from_rate, amount)
            self.__redis_conn.setex(cache_key, 120, conversion)
            # return conversion result
            return [{'conversion': conversion}, 200]
        except Exception as e:
            print(f'{PREFIX} - Internal error occurred: {e}')
            return ERROR_OBJ

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
