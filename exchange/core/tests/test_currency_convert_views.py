from django.urls import reverse
from rest_framework.test import APITestCase


class CurrencyConvertGetValidTest(APITestCase):
    fixtures = ['currencies.json']

    def test_get(self):
        query_params = {'from': 'BRL', 'to': 'USD', 'amount': 1}
        response = self.client.get(reverse('convert-list'), query_params)
        self.assertEqual(200, response.status_code)

    def test_json(self):
        query_params = {'from': 'BRL', 'to': 'USD', 'amount': 1}
        response = self.client.get(reverse('convert-list'), query_params)

        contents = ('from_', 'to', 'amount', 'rates', 'converted_amount')
        for key in contents:
            with self.subTest():
                self.assertIn(key, response.json())

    def test_converted_amount(self):
        response = self._get_and_return_json({'from': 'BRL', 'to': 'USD', 'amount': 1})
        self.assertEqual(0.19, response.get('converted_amount'))

    def test_convert_fictional_currency_to_fiat_currency(self):
        response = self._get_and_return_json({'from': 'GTA$', 'to': 'BRL', 'amount': 1250000})
        self.assertEqual(83.5, response.get('converted_amount'))

    def test_convert_currencies_with_differents_backed_to(self):
        response = self._get_and_return_json({'from': 'GTA$', 'to': 'HURB', 'amount': 1250000})
        self.assertEqual(7.36, response.get('converted_amount'))

    def _get_and_return_json(self, query_params):
        response = self.client.get(reverse('convert-list'), query_params)
        return response.json()


class CurrencyConvertGetInvalidTest(APITestCase):
    def test_get(self):
        response = self.client.get(reverse('convert-list'))
        self.assertEqual(400, response.status_code)

    def test_erros_without_query_params(self):
        response = self.client.get(reverse('convert-list'))
        errors = response.json().get('errors')

        expected = [
            {'from_': 'This field may not be blank.'},
            {'to': 'This field may not be blank.'},
            {'amount': 'This field may not be blank.'}]

        self.assertListEqual(expected, errors)

    def test_json(self):
        response = self.client.get(reverse('convert-list'))

        contents = ('from_', 'to', 'amount', 'errors')
        for key in contents:
            with self.subTest():
                self.assertIn(key, response.json())

    def test_from_blank(self):
        errors = self._get_and_return_errors({'from': '', 'to': 'USD', 'amount': 1})
        self.assertListEqual([{'from_': 'This field may not be blank.'}], errors)

    def test_to_blank(self):
        errors = self._get_and_return_errors({'from': 'BRL', 'to': '', 'amount': 1})
        self.assertListEqual([{'to': 'This field may not be blank.'}], errors)

    def test_amount_blank(self):
        errors = self._get_and_return_errors({'from': 'BRL', 'to': 'USD', 'amount': ''})
        self.assertListEqual([{'amount': 'This field may not be blank.'}], errors)

    def test_amount_not_a_number(self):
        errors = self._get_and_return_errors({'from': 'BRL', 'to': 'USD', 'amount': '1abc'})
        self.assertListEqual([{'amount': 'A valid number is required.'}], errors)

    def _get_and_return_errors(self, query_params):
        response = self.client.get(reverse('convert-list'), query_params)
        return response.json().get('errors')
