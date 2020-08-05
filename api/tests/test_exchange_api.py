import unittest
import requests

from unittest.mock import patch

from api.app import cache, OpenExchangeApi

GET_REQUESTS_PATH = 'api.exchange_api.requests.get'
FAKE_RATES = {
    'BRL': 5.15,
    'EUR': 0.90
}


def fake_200():
    r = requests.Response()
    r.status_code = 200
    r.json = lambda: {'rates': FAKE_RATES}
    return r


def fake_500():
    r = requests.Response()
    r.status_code = 500
    return r


class TestIntegrationOpenExchange(unittest.TestCase):
    exchange = OpenExchangeApi

    def setUp(self):
        cache.delete_memoized(OpenExchangeApi._get_rates_from_api)
        cache.delete_memoized(OpenExchangeApi.get_currency_rate)

    def test_get_rates_from_api_should_return_all_currencies_rates(self):
        currencies = self.exchange._get_rates_from_api()

        self.assertIsInstance(currencies, dict)
        self.assertIsNotNone(currencies['BRL'])
        self.assertIsNotNone(currencies['ETH'])


class TestOpenExchange(unittest.TestCase):
    exchange = OpenExchangeApi

    def setUp(self):
        cache.delete_memoized(OpenExchangeApi._get_rates_from_api)
        cache.delete_memoized(OpenExchangeApi.get_currency_rate)

    @patch(GET_REQUESTS_PATH, return_value=fake_200())
    def test_get_currencies_rate_should_return_all_currencies(self, mock):
        currencies = self.exchange.get_currencies_rate()
        self.assertEqual(currencies, FAKE_RATES)

    @patch(GET_REQUESTS_PATH, return_value=fake_200())
    def test_get_currency_rate_should_return_current_rate(self, mock):
        currency_rate = self.exchange.get_currency_rate('BRL')
        self.assertEqual(currency_rate, 5.15)

    @patch(GET_REQUESTS_PATH, return_value=fake_200())
    def test_get_rates_from_api_should_be_cached(self, mock):
        self.exchange._get_rates_from_api()
        self.exchange._get_rates_from_api()

        self.assertEqual(mock.call_count, 2)

    @patch(GET_REQUESTS_PATH, return_value=fake_200())
    def test_get_currency_rate_should_be_cached(self, mock):
        self.exchange.get_currency_rate('BRL')
        self.exchange.get_currency_rate('BRL')

        self.assertEqual(mock.call_count, 2)

    @patch(GET_REQUESTS_PATH, return_value=fake_200())
    def test_get_rates_from_blockchains_should_be_divide_by_dolar(self, mock):
        rates = self.exchange._get_rates_from_blockchains()

        self.assertEqual(round(rates['BRL'], 2), 0.19)

    @patch(GET_REQUESTS_PATH, return_value=fake_500())
    def test_get_currencies_rate_should_return_empty_on_api_error(self, mock):
        currencies = self.exchange.get_currencies_rate()
        self.assertEqual(currencies, {})

    @patch(GET_REQUESTS_PATH, return_value=fake_500())
    def test_get_currency_rate_should_return_none_on_api_error(self, mock):
        currency_rate = self.exchange.get_currency_rate('BRL')
        self.assertIsNone(currency_rate)