import json
import requests
from unittest.mock import Mock
from unittest.mock import patch
from desafio.services import ServiceQuoteCurrencyPrice
import unittest


class TestServiceQuoteCurrencyPrice(unittest.TestCase):

    def setUp(self):
        self.service_currence = ServiceQuoteCurrencyPrice(
            'BRL', ['USD', 'JPY', 'EUR'])

        self.mock_quotes_result = {
            "USD": 0.1844,
            "JPY": 19.56,
            "EUR":  0.1567
        }
        self.money = 20
        self.round_value = 2

    def _mock_response(
            self,
            status=200,
            json_data=None,
            raise_for_status=None):

        mock_resp = Mock()
        mock_resp.raise_for_status = Mock()

        if raise_for_status:
            mock_resp.raise_for_status.side_effect = raise_for_status

        mock_resp.status_code = status

        if json_data:
            mock_resp.content = Mock()
            mock_resp.content.decode = Mock()
            mock_resp.content.decode.return_value = json.dumps(json_data)

        return mock_resp

    @patch('requests.get')
    def test_1_deve_retornar_none_if_currency_not_exist(self, mock_get):
        mock_resp = self._mock_response(
            json_data=self.mock_quotes_result, status=400)
        mock_get.return_value = mock_resp
        self.assertIsNone(self.service_currence.get_currencies_quote())

    @patch('requests.get')
    def test_2_deve_retornar_currency_quotes(self, mock_get):
        mock_resp = self._mock_response(json_data=self.mock_quotes_result)
        mock_get.return_value = mock_resp

        currencies_quote = self.service_currence.get_currencies_quote()

        self.assertEqual(currencies_quote['USD'],
                         self.mock_quotes_result['USD'])
        self.assertEqual(currencies_quote['JPY'],
                         self.mock_quotes_result['JPY'])
        self.assertEqual(currencies_quote['EUR'],
                         self.mock_quotes_result['EUR'])

    @patch('requests.get')
    def test_3_deve_retornar_valor_moeda_by_currencys_quote(self, mock_get):
        mock_resp = self._mock_response(json_data=self.mock_quotes_result)
        mock_get.return_value = mock_resp
        prices_currency = self.service_currence \
            .calc_currency_price_by_currencies_quote(
                self.money)

        self.assertEqual(prices_currency['USD'],  round(
            self.mock_quotes_result['USD']*self.money, self.round_value))
        self.assertEqual(prices_currency['JPY'],  round(
            self.mock_quotes_result['JPY']*self.money, self.round_value))
        self.assertEqual(prices_currency['EUR'],  round(
            self.mock_quotes_result['EUR']*self.money, self.round_value))

    @patch('requests.get')
    def test_4_deve_falhar_quando_symbol_currency_nao_exisitr(self, mock_get):
        mock_error_result = {
            "Response": 'Error'
        }
        mock_resp = self._mock_response(json_data=mock_error_result)
        mock_get.return_value = mock_resp
        result = self.service_currence \
            .find_symbol_currency("INEXISTENTE")

        self.assertEqual(
            result['Response'], "Error")

    @patch('requests.get')
    def test_5_deve_encontrar_simbolo(self, mock_get):
        mock_error_result = {
            "Response": 'Success'
        }
        mock_resp = self._mock_response(json_data=mock_error_result)
        mock_get.return_value = mock_resp
        result = self.service_currence \
            .find_symbol_currency("BRL")

        self.assertEqual(
            result['Response'], "Success")
