import unittest

from api.app import redisConnector
from api.models import Currencies, Currency


class TestCurrencyModel(unittest.TestCase):

    def tearDown(self):
        redisConnector.delete('currencies')

    def test_instance_model_should_create_new_object(self):
        currency = Currency('BRL', 2.0)

        self.assertIsInstance(currency, Currency)
        self.assertEqual(currency.currency_id, 'BRL')
        self.assertEqual(currency.rate, 2.0)

    def test_instance_should_be_renderized_in_dict(self):
        currency = Currency('BRL', 2.0)
        currency_json = currency.to_dict()

        self.assertEqual(currency_json, {'id': 'BRL', 'rate': 2.0})

    def test_instance_should_have_save_method(self):
        currency = Currency('BRL', 2.0)
        currency.save()

        rate = redisConnector.hget('currencies', 'BRL')

        self.assertEqual(rate, '2.0')

    def test_instance_should_have_delete_method(self):
        currency = Currency('BRL', 2.0)
        currency.save()
        currency.delete()

        rate = redisConnector.hget('currencies', 'BRL')

        self.assertIsNone(rate)


class TestCurrencies(unittest.TestCase):

    def setUp(self):
        redisConnector.hset('currencies', 'USD', 1.00)
        redisConnector.hset('currencies', 'BRL', 5.15)

    def tearDown(self):
        redisConnector.delete('currencies')

    def test_all_should_return_all_currencies(self):
        currencies = Currencies.all()

        self.assertEqual(len(currencies), 2)
        self.assertEqual(currencies[0].currency_id, 'USD')
        self.assertEqual(currencies[0].rate, 1.00)

    def test_get_should_return_selected_currency(self):
        currency = Currencies.get('USD')

        self.assertEqual(currency.currency_id, 'USD')
        self.assertEqual(currency.rate, 1.00)

    def test_get_should_return_none_when_not_exists_currency(self):
        currency = Currencies.get('EUR')

        self.assertIsNone(currency)

    def test_create_should_save_and_return_new_currency(self):
        created, currency = Currencies.create('EUR', 3.00)

        rate = redisConnector.hget('currencies', 'EUR')

        self.assertTrue(created)
        self.assertEqual(currency.currency_id, 'EUR')
        self.assertEqual(currency.rate, 3.00)
        self.assertEqual(rate, '3.0')

    def test_create_should_return_none_when_already_exists(self):
        created, currency = Currencies.create('USD', 3.00)

        self.assertFalse(created)
        self.assertEqual(currency.currency_id, 'USD')
        self.assertEqual(currency.rate, 1.00)