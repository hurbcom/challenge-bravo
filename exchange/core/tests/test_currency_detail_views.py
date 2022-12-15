from datetime import datetime

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework.test import APITestCase

from exchange.core.models import Currency


class CurrencyDetailGetViewTest(APITestCase):
    def setUp(self):
        currency = Currency.objects.create(code='BRL', rate=5.321)
        self.response = self.client.get(
            reverse('currency-detail', args=[currency.pk]))

    def test_get(self):
        self.assertEqual(200, self.response.status_code)

    def test_json(self):
        contents = ('pk', 'code', 'backed_to', 'rate', 'type', 'updated_at')
        for key in contents:
            with self.subTest():
                self.assertIn(key, self.response.json())


class CurrencyDetailNotFoundTest(APITestCase):
    def setUp(self):
        self.response = self.client.get(reverse('currency-detail', args=[0]))

    def test_get(self):
        self.assertEqual(404, self.response.status_code)

    def test_json(self):
        self.assertEqual({'detail': 'Not found.'}, self.response.json())


class CurrencyDetailPutValidViewTest(APITestCase):
    def setUp(self):
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
        self.assertEqual(200, self.response.status_code)

    def test_json(self):
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
        new_updated_at = self.response.json().get('updated_at')
        old_updated_at = self.currency.updated_at.strftime(
            '%Y-%m-%dT%H:%M:%S.%fZ')

        self.assertNotEqual(new_updated_at, old_updated_at)


class CurrencyListInvalidPutViewTest(APITestCase):
    def setUp(self):
        self.valid_data = {'code': 'BRL', 'rate': 5.321}
        self.currency = Currency.objects.create(**self.valid_data)

    def test_code_blank(self):
        errors = self._put_and_get_errors(code='')
        self.assertSequenceEqual(errors, ['This field may not be blank.'])

    def test_rate_blank(self):
        errors = self._put_and_get_errors(rate='')
        self.assertSequenceEqual(errors, ['A valid number is required.'])

    def test_rate_not_a_number(self):
        errors = self._put_and_get_errors(rate='abc')
        self.assertSequenceEqual(errors, ['A valid number is required.'])

    def test_type_not_available(self):
        errors = self._put_and_get_errors(type='abc')
        self.assertSequenceEqual(errors, ['"abc" is not a valid choice.'])

    def _put_and_get_errors(self, **kwargs):
        data = dict(self.valid_data, **kwargs)
        response = self.client.put(
            reverse('currency-detail', args=[self.currency.pk]), data)
        key = tuple(kwargs)[0]
        return response.json().get(key)


class CurrencyDetailDeleteViewTest(APITestCase):
    def setUp(self):
        currency = Currency.objects.create(code='BRL', rate=5.321)
        self.response = self.client.delete(reverse('currency-detail', args=[currency.pk]))

    def test_delete(self):
        self.assertEqual(204, self.response.status_code)

    def test_currency(self):
        self.assertFalse(Currency.objects.exists())
