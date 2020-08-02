import unittest
import requests

from unittest.mock import patch

from api.app import cache
from api.open_exchange import OpenExchange

GET_REQUESTS_PATH = 'api.open_exchange.requests.get'
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
    exchange = OpenExchange('9e99dd7952614fb494bc2fa538c7a7c4')

    def setUp(self):
        cache.delete_memoized(OpenExchange._get_rates_from_api)

    def test_get_rates_from_api_should_return_all_currencies_rates(self):
        currencies = self.exchange._get_rates_from_api()

        self.assertIsInstance(currencies, dict)
        self.assertIsNotNone(currencies['BRL'])

    def test_get_rates_from_api_should_be_cached(self):
        self.exchange._get_rates_from_api()

        with patch(GET_REQUESTS_PATH) as mock:
            self.exchange._get_rates_from_api()
            self.assertFalse(mock.called)


class TestOpenExchange(unittest.TestCase):
    exchange = OpenExchange('9e99dd7952614fb494bc2fa538c7a7c4')

    def setUp(self):
        cache.delete_memoized(OpenExchange._get_rates_from_api)

    @patch(GET_REQUESTS_PATH, return_value=fake_200())
    def test_get_currencies_rate_should_return_all_currencies(self, mock):
        currencies = self.exchange.get_currencies_rate()
        self.assertEqual(currencies, FAKE_RATES)

    @patch(GET_REQUESTS_PATH, return_value=fake_200())
    def test_get_currency_rate_should_return_current_rate(self, mock):
        currency_rate = self.exchange.get_currency_rate('BRL')
        self.assertEqual(currency_rate, 5.15)

    @patch(GET_REQUESTS_PATH, return_value=fake_500())
    def test_get_currencies_rate_should_return_empty_on_api_error(self, mock):
        currencies = self.exchange.get_currencies_rate()
        self.assertEqual(currencies, {})

    @patch(GET_REQUESTS_PATH, return_value=fake_500())
    def test_get_currency_rate_should_return_none_on_api_error(self, mock):
        currency_rate = self.exchange.get_currency_rate('BRL')
        self.assertIsNone(currency_rate)