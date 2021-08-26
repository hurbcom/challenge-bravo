from src.conversion_service import ConversionService
from src.redis_connector import RedisConnector
import unittest

service = ConversionService()


class ConversionServiceTestSuite(unittest.TestCase):
    def tearDown(self):
        service.delete_currency('OTHER_TEST')

    def test_all_real_service(self):
        [real_currencies, status] = service.get_all_real_currencies()
        self.assertTrue(len(real_currencies['currencies']) > 0)
        self.assertTrue(status == 200)

    def test_get_all_user_created_currencies(self):
        [user_created_currencies, status] = service.get_all_user_created_currencies()
        self.assertTrue(len(user_created_currencies['currencies']) > 0)
        self.assertTrue(status == 200)

    def test_get_all_currencies(self):
        [all_currencies, status] = service.get_all_currencies()
        self.assertTrue(all_currencies['currencies'].index('USD') >= 0)
        self.assertTrue(all_currencies['currencies'].index('TEST') >= 0)
        self.assertTrue(status == 200)

    def test_get_by_name_user_created(self):
        target = 'TEST'
        [result, status] = service.get_by_name_user_created(target)
        self.assertEqual(target, result['result'][0][0])
        self.assertEqual(1.2, result['result'][0][1])
        self.assertTrue(status == 200)

    def test_get_by_name_real_currency(self):
        target = 'BRL'
        [result, status] = service.get_by_name_real_currency(target)
        self.assertEqual(target, result['name'])
        self.assertTrue(result['base_value'] > 0)
        self.assertTrue(status == 200)

    def test_create_currency(self):
        name = 'TEST_CREATE'
        base_value = 1.35
        [response, status] = service.create_currency(name, base_value)
        [get_result, _] = service.get_by_name_user_created(name)
        self.assertTrue(response['success'])
        self.assertTrue(status == 200)
        self.assertEqual(get_result['result'][0][0], name)
        self.assertEqual(get_result['result'][0][1], base_value)
        service.delete_currency(name)

    def test_delete_currency(self):
        name = 'TEST_DELETE'
        service.create_currency(name, 1.2)
        [response, status] = service.delete_currency(name)
        self.assertTrue(response['success'])
        self.assertTrue(status == 200)

    def test_update_currency(self):
        name = 'TEST_UPDATE'
        new_base_value = 3.56
        service.create_currency(name, 1.2)
        [response, status] = service.update_currency(name, new_base_value)
        [result, _] = service.get_by_name_user_created(name)
        self.assertEqual(new_base_value, result['result'][0][1])
        self.assertEqual(response['rows_affected'], 1)
        self.assertTrue(status == 200)
        service.delete_currency(name)

    # TODO: have a safer way of testing conversion results with assertAlmostEquals
    def test_conversion_both_real(self):
        currency_from = 'BRL'
        currency_to = 'EUR'  # (to/from)*amount
        amount = 16
        [response, status] = service.convert(
            currency_from, currency_to, amount)
        self.assertAlmostEqual(response['conversion'], 2.60, places=1)
        self.assertTrue(status == 200)

    def test_conversion_one_real_one_created(self):
        currency_from = 'USD'
        currency_to = 'TEST'
        amount = 16
        [response, status] = service.convert(
            currency_from, currency_to, amount)
        self.assertEqual(response['conversion'], 19.2)
        self.assertTrue(status == 200)

    # TODO: have a safer way of testing conversion results with assertAlmostEquals
    def test_conversion_one_created_one_real(self):
        currency_from = 'TEST'
        currency_to = 'EUR'
        amount = 16
        [response, status] = service.convert(
            currency_from, currency_to, amount)
        self.assertAlmostEqual(response['conversion'], 11.31, places=1)
        self.assertTrue(status == 200)

    def test_conversion_both_created(self):
        currency_from = 'TEST'
        currency_to = 'OTHER_TEST'
        amount = 16
        service.create_currency(currency_to, 0.5631)
        [response, status] = service.convert(
            currency_from, currency_to, amount)
        self.assertEqual(response['conversion'], 7.51)
        self.assertTrue(status == 200)
        service.delete_currency(currency_to)

    def test_conversion_both_currencies_are_equal(self):
        currency_from = 'BRL'
        currency_to = 'BRL'
        amount = 32.1
        [response, status] = service.convert(
            currency_from, currency_to, amount)
        self.assertEqual(response['conversion'], amount)
        self.assertTrue(status == 200)

    def test_conversion_save_operation_to_cache(self):
        currency_from = 'BTC'
        currency_to = 'ETH'
        amount = 8.0
        [response, _] = service.convert(currency_from, currency_to, amount)
        connector = RedisConnector()
        cached_operation = connector.get_connection().get(
            f'{currency_from}_{amount}_{currency_to}')
        self.assertEqual(response['conversion'], float(
            cached_operation.decode('utf-8')))
        del connector

    # TODO: find a better way to test if the cache is being used by the api
    def test_conversion_cache_is_being_used(self):
        currency_from = 'BRL'
        currency_to = 'ETH'
        amount = 8123.56
        [first_response, _] = service.convert(
            currency_from, currency_to, amount)
        [second_response, _] = service.convert(
            currency_from, currency_to, amount)
        self.assertEqual(
            first_response['conversion'], second_response['conversion'])

    def test_conversion_get_by_name_real_currency_empty(self):
        target = 'INVALID'
        [result, status] = service.get_by_name_real_currency(target)
        self.assertTrue(result == {})
        self.assertTrue(status == 404)

    def test_conversion_amount_zero_or_less(self):
        currency_from = 'BRL'
        currency_to = 'ETH'
        amount = -101.03
        [response, status] = service.convert(
            currency_from, currency_to, amount)
        self.assertEqual(
            response['conversion'], "Amount must be higher than zero!")
        self.assertTrue(status == 400)

    def test_conversion_currency_not_found(self):
        currency_from = 'BRL'
        currency_to = 'INVALID'
        amount = 12.1
        [response, status] = service.convert(
            currency_from, currency_to, amount)
        self.assertEqual(
            response['conversion'], "One of the currencies provided was not found. Double check your currencies and try again.")
        self.assertTrue(status == 404)

    def test_conversion_create_blank_param(self):
        name = ''
        base_value = None
        [response, status] = service.create_currency(name, base_value)
        self.assertFalse(response['success'])
        self.assertEqual(
            response['error'], 'One or more parameters were invalid or blank.')
        self.assertTrue(status == 400)

    def test_conversion_create_negative_base_value(self):
        name = 'TEST_FAIL'
        base_value = -100.01
        [response, status] = service.create_currency(name, base_value)
        self.assertFalse(response['success'])
        self.assertEqual(
            response['error'], 'One or more parameters were invalid or blank.')
        self.assertTrue(status == 400)

    def test_conversion_update_blank_param(self):
        name = ''
        new_base_value = 3.56
        [response, status] = service.update_currency(name, new_base_value)
        self.assertEqual(response['rows_affected'], 0)
        self.assertEqual(
            response['error'], 'One or more parameters were invalid or blank.')
        self.assertTrue(status == 400)

    def test_conversion_update_negative_base_value(self):
        name = 'TEST_FAIL'
        new_base_value = -13.56
        [response, status] = service.update_currency(name, new_base_value)
        self.assertEqual(response['rows_affected'], 0)
        self.assertEqual(
            response['error'], 'One or more parameters were invalid or blank.')
        self.assertTrue(status == 400)

    def test_conversion_update_param_is_NoneType(self):
        name = None
        new_base_value = None
        [response, status] = service.update_currency(name, new_base_value)
        self.assertEqual(response['rows_affected'], 0)
        self.assertEqual(
            response['error'], 'One or more parameters were invalid or blank.')
        self.assertTrue(status == 400)
