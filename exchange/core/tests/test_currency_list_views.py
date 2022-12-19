from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework.test import APITestCase

from exchange.core.models import Currency


class CurrencyListGetViewTest(APITestCase):
    def setUp(self):
        """Requests GET /currencies/ for all tests"""
        self.response = self.client.get(reverse('currency-list'))

    def test_get(self):
        """GET /currencies/ must return status code 200"""
        self.assertEqual(200, self.response.status_code)

    def test_list_empty(self):
        """Response JSON must be empty"""
        self.assertListEqual([], self.response.json())

    def test_list(self):
        """Response JSON must have these keys:
        pk, code, backed_to, rate, type, updated_at
        """
        Currency.objects.create(code='BRL', rate=5.321)

        response = self.client.get(reverse('currency-list'))
        response = response.json()[0]

        contents = ('pk', 'code', 'backed_to', 'rate', 'type', 'updated_at')
        for key in contents:
            with self.subTest():
                self.assertIn(key, response)


class CurrencyListPostValidViewTest(APITestCase):
    def setUp(self):
        """Requests POST /currencies/ for all tests"""
        data = {'code': 'BRL', 'rate': 5.321}
        self.response = self.client.post(reverse('currency-list'), data)

    def test_post(self):
        """POST /currencies/ must return status code 201"""
        self.assertEqual(201, self.response.status_code)

    def test_create(self):
        """Currency objects must exists"""
        self.assertTrue(Currency.objects.exists())

    def test_json(self):
        """Response JSON must have these keys:
        pk, code, backed_to, rate, type, updated_at
        """
        contents = ('pk', 'code', 'backed_to', 'rate', 'type', 'updated_at')
        for key in contents:
            with self.subTest():
                self.assertIn(key, self.response.json())


class CurrencyListPostInvalidViewTest(APITestCase):
    def test_code_blank(self):
        """POST /currencies/ with `code` blank must return an error"""
        errors = self._post_and_return_errors(code='')
        self.assertSequenceEqual(errors, ['This field may not be blank.'])

    def test_rate_blank(self):
        """POST /currencies/ with `rate` blank must return an error"""
        errors = self._post_and_return_errors(rate='')
        self.assertSequenceEqual(errors, ['A valid number is required.'])

    def test_rate_not_a_number(self):
        """POST /currencies/ with `rate` not a number must return an error"""
        errors = self._post_and_return_errors(rate='abc')
        self.assertSequenceEqual(errors, ['A valid number is required.'])

    def test_type_not_available(self):
        """POST /currencies/ with `type` not available must return an error"""
        errors = self._post_and_return_errors(type='abc')
        self.assertSequenceEqual(errors, ['"abc" is not a valid choice.'])

    def _post_and_return_errors(self, **kwargs):
        """Makes POST request and returns json.

        : args
        - query_params: dict
            - keys:
                - from: str
                - to: str
                - amount: float

        return requests.Response.json
        """
        valid_data = {'code': 'BRL', 'rate': 5.321}
        data = dict(valid_data, **kwargs)
        response = self.client.post(reverse('currency-list'), data)
        key = tuple(kwargs)[0]
        return response.json().get(key)
