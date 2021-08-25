from src.convertion_service import ConvertionService
from src.redis_connector import RedisConnector
import unittest

service = ConvertionService()


class ConvertionServiceTestSuite(unittest.TestCase):
    def tearDown(self):
        service.delete_currency('OTHER_TEST')

    def test_all_real_service(self):
        real_currencies = service.get_all_real_currencies()
        self.assertTrue(len(real_currencies['currencies']) > 0)

    def test_get_all_user_created_currencies(self):
        user_created_currencies = service.get_all_user_created_currencies()
        self.assertTrue(len(user_created_currencies['currencies']) > 0)

    def test_get_all_currencies(self):
        all_currencies = service.get_all_currencies()
        self.assertTrue(all_currencies['currencies'].index('USD') >= 0)
        self.assertTrue(all_currencies['currencies'].index('TEST') >= 0)

    def test_get_by_name_user_created(self):
        target = 'TEST'
        result = service.get_by_name_user_created(target)
        self.assertEqual(target, result['result'][0][0])
        self.assertEqual(1.2, result['result'][0][1])

    def test_get_by_name_real_currency(self):
        target = 'BRL'
        result = service.get_by_name_real_currency(target)
        self.assertEqual(target, result['name'])
        self.assertTrue(result['base_value'] > 0)

    def test_create_currency(self):
        name = 'TEST_CREATE'
        base_value = 1.35
        response = service.create_currency(name, base_value)
        get_result = service.get_by_name_user_created(name)
        self.assertTrue(response)
        self.assertEqual(get_result['result'][0][0], name)
        self.assertEqual(get_result['result'][0][1], base_value)
        service.delete_currency(name)

    def test_delete_currency(self):
        name = 'TEST_DELETE'
        service.create_currency(name, 1.2)
        response = service.delete_currency(name)
        self.assertTrue(response)

    def test_update_currency(self):
        name = 'TEST_UPDATE'
        new_base_value = 3.56
        service.create_currency(name, 1.2)
        response = service.update_currency(name, new_base_value)
        result = service.get_by_name_user_created(name)
        self.assertEqual(new_base_value, result['result'][0][1])
        self.assertEqual(response['rows_affected'], 1)
        service.delete_currency(name)

    # TODO: have a safer way of testing conversion results with assertAlmostEquals
    def test_convertion_both_real(self):
        currency_from = 'BRL'
        currency_to = 'EUR'  # (to/from)*amount
        amount = 16
        response = service.convert(currency_from, currency_to, amount)
        self.assertAlmostEqual(response['conversion'], 2.60, places=1)

    def test_conversion_one_real_one_created(self):
        currency_from = 'USD'
        currency_to = 'TEST'
        amount = 16
        response = service.convert(
            currency_from, currency_to, amount)
        self.assertEqual(response['conversion'], 19.2)

    # TODO: have a safer way of testing conversion results with assertAlmostEquals
    def test_conversion_one_created_one_real(self):
        currency_from = 'TEST'
        currency_to = 'EUR'
        amount = 16
        response = service.convert(
            currency_from, currency_to, amount)
        self.assertAlmostEqual(response['conversion'], 11.31, places=1)

    def test_conversion_both_created(self):
        currency_from = 'TEST'
        currency_to = 'OTHER_TEST'
        amount = 16
        service.create_currency(currency_to, 0.5631)
        response = service.convert(
            currency_from, currency_to, amount)
        self.assertEqual(response['conversion'], 7.51)
        service.delete_currency(currency_to)

    def test_conversion_save_operation_to_cache(self):
        currency_from = 'BTC'
        currency_to = 'ETH'
        amount = 8
        response = service.convert(currency_from, currency_to, amount)
        connector = RedisConnector()
        cached_operation = connector.get_connection().get(
            f'{currency_from}_{amount}_{currency_to}')
        self.assertEqual(response['conversion'], float(
            cached_operation.decode('utf-8')))
        del connector

    # TODO: maybe find a way to test if the api is using the cached conversions?
