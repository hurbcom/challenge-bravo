import unittest
import requests

from unittest.mock import patch

from api.open_exchange import OpenExchange


# class TestIntegrationOpenExchange(unittest.TestCase):
#     exchange = OpenExchange('9e99dd7952614fb494bc2fa538c7a7c4')

#     def test_get_currencies_rate_should_return_all_currencies_rates(self):
#         currencies = self.exchange.get_currencies_rate()

#         self.assertIsInstance(currencies, dict)
#         self.assertIsNotNone(currencies['BRL'])

#     def test_get_currency_rate_should_return_current_rate(self):
#         currency_rate = self.exchange.get_currency_rate('BRL')
#         self.assertIsInstance(currency_rate, float)


class TestOpenExchange(unittest.TestCase):
    exchange = OpenExchange('9e99dd7952614fb494bc2fa538c7a7c4')

    @patch('api.open_exchange.requests.get')
    def test_get_currencies_rate_should_return_all_currencies(self, mock):
        mock.return_value = self._fake_200_response()

        currencies = self.exchange.get_currencies_rate()
        self.assertEqual(currencies, {
            'BRL': 5.15,
            'EUR': 0.90
        })

    @patch('api.open_exchange.requests.get')
    def test_get_currency_rate_should_return_current_rate(self, mock):
        mock.return_value = self._fake_200_response()

        currency_rate = self.exchange.get_currency_rate('BRL')
        self.assertEqual(currency_rate, 5.15)

    @patch('api.open_exchange.requests.get')
    def test_get_currencies_rate_should_return_empty_dict_on_api_error(self, mock):
        mock.return_value = self._fake_500_response()

        currencies = self.exchange.get_currencies_rate()
        self.assertEqual(currencies, {})

    @patch('api.open_exchange.requests.get')
    def test_get_currency_rate_should_return_none_on_api_error(self, mock):
        mock.return_value = self._fake_500_response()

        currency_rate = self.exchange.get_currency_rate('BRL')
        self.assertIsNone(currency_rate)

    def _fake_200_response(self):
        r = requests.Response()
        r.status_code = 200
        r.json = lambda: {
            'rates': {
                'BRL': 5.15,
                'EUR': 0.90
            }
        }
        return r

    def _fake_500_response(self):
        r = requests.Response()
        r.status_code = 500
        return r