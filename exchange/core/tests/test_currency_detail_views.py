from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework.test import APITestCase

from exchange.core.models import Currency


class CurrencyDetailGetViewTest(APITestCase):
    def setUp(self):
        """Creates a currency and requests GET /currencies/1/ for all tests"""
        currency = Currency.objects.create(code='BRL', rate=5.321)
        self.response = self.client.get(
            reverse('currency-detail', args=[currency.pk]))

    def test_get(self):
        """GET /currencies/1/ must return status code 200"""
        self.assertEqual(200, self.response.status_code)

    def test_json(self):
        """Response JSON must have these keys:
        pk, code, backed_to, rate, type, updated_at
        """
        contents = ('pk', 'code', 'backed_to', 'rate', 'type', 'updated_at')
        for key in contents:
            with self.subTest():
                self.assertIn(key, self.response.json())


class CurrencyDetailGetNotFoundTest(APITestCase):
    def setUp(self):
        """Requests GET /currencies/0/ for all tests"""
        self.response = self.client.get(reverse('currency-detail', args=[0]))

    def test_get(self):
        """GET /currencies/0/ must return status code 404"""
        self.assertEqual(404, self.response.status_code)

    def test_json(self):
        """Response JSON must return not found"""
        self.assertEqual({'detail': 'Not found.'}, self.response.json())


class CurrencyDetailPutValidViewTest(APITestCase):
    def setUp(self):
        """Creates a currency and requests PUT /currencies/1/ with updated data for all tests"""
        self.currency = Currency.objects.create(code='BRL', rate=5.321)

        data = {
            'code': 'btc',
            'backed_to': 'brl',
            'rate': 1.0,
            'type': 'crypto'
        }
        self.response = self.client.put(
            reverse('currency-detail', args=[self.currency.pk]), data)

    def test_put(self):
        """PUT /currencies/1/ must return status code 200"""
        self.assertEqual(200, self.response.status_code)

    def test_json(self):
        """Response JSON must return these contents:
        pk=1, code=BTC, backed_to=BRL, rate=1.0, type=crype
        """
        response = self.response.json()

        contents = (
            ('pk', 1),
            ('code', 'BTC'),
            ('backed_to', 'BRL'),
            ('rate', 1.0),
            ('type', 'crypto'),
        )

        for key, expected in contents:
            with self.subTest():
                self.assertEqual(expected, response.get(key))

    def test_updated_at(self):
        """Attribute updated_at must be different"""
        new_updated_at = self.response.json().get('updated_at')
        old_updated_at = self.currency.updated_at.strftime(
            '%Y-%m-%dT%H:%M:%S.%fZ')

        self.assertNotEqual(new_updated_at, old_updated_at)


class CurrencyListPutInvalidViewTest(APITestCase):
    def setUp(self):
        """Creates a currency for all tests"""
        self.valid_data = {'code': 'BRL', 'rate': 5.321}
        self.currency = Currency.objects.create(**self.valid_data)

    def test_code_blank(self):
        """PUT /currencies/1/ with `code` blank must return an error"""
        errors = self._put_and_return_errors(code='')
        self.assertSequenceEqual(errors, ['This field may not be blank.'])

    def test_rate_blank(self):
        """PUT /currencies/1/ with `rate` blank must return an error"""
        errors = self._put_and_return_errors(rate='')
        self.assertSequenceEqual(errors, ['A valid number is required.'])

    def test_rate_not_a_number(self):
        """PUT /currencies/1/ with `rate` not a number must return an error"""
        errors = self._put_and_return_errors(rate='abc')
        self.assertSequenceEqual(errors, ['A valid number is required.'])

    def test_type_not_available(self):
        """PUT /currencies/1/ with `type` not available must return an error"""
        errors = self._put_and_return_errors(type='abc')
        self.assertSequenceEqual(errors, ['"abc" is not a valid choice.'])

    def _put_and_return_errors(self, **kwargs):
        """Makes PUT request and returns json.

        : args
        - query_params: dict
            - keys:
                - from: str
                - to: str
                - amount: float

        return requests.Response.json
        """
        data = dict(self.valid_data, **kwargs)
        response = self.client.put(
            reverse('currency-detail', args=[self.currency.pk]), data)
        key = tuple(kwargs)[0]
        return response.json().get(key)


class CurrencyDetailDeleteViewTest(APITestCase):
    def setUp(self):
        """Creates a currency and requests DELETE /currencies/1/ for all tests"""
        currency = Currency.objects.create(code='BRL', rate=5.321)
        self.response = self.client.delete(reverse('currency-detail', args=[currency.pk]))

    def test_delete(self):
        """DELETE /currencies/1/ must return status code 204"""
        self.assertEqual(204, self.response.status_code)

    def test_currency(self):
        """Currency objects must be empty"""
        self.assertFalse(Currency.objects.exists())
