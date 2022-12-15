from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework.test import APITestCase

from exchange.core.models import Currency


class CurrencyListGetViewTest(APITestCase):
    def setUp(self):
        self.response = self.client.get(reverse('currency-list'))

    def test_get(self):
        self.assertEqual(200, self.response.status_code)

    def test_list_empty(self):
        self.assertListEqual([], self.response.json())

    def test_list(self):
        Currency.objects.create(code='BRL', rate=5.321)

        response = self.client.get(reverse('currency-list'))
        response = response.json()[0]

        contents = ('pk', 'code', 'backed_to', 'rate', 'type', 'updated_at')
        for key in contents:
            with self.subTest():
                self.assertIn(key, response)


class CurrencyListPostValidViewTest(APITestCase):
    def setUp(self):
        data = {'code': 'BRL', 'rate': 5.321}
        self.response = self.client.post(reverse('currency-list'), data)

    def test_post(self):
        self.assertEqual(201, self.response.status_code)

    def test_create(self):
        self.assertTrue(Currency.objects.exists())

    def test_json(self):
        contents = ('pk', 'code', 'backed_to', 'rate', 'type', 'updated_at')
        for key in contents:
            with self.subTest():
                self.assertIn(key, self.response.json())


class CurrencyListPostInvalidViewTest(APITestCase):
    def test_code_blank(self):
        errors = self._post_and_return_errors(code='')
        self.assertSequenceEqual(errors, ['This field may not be blank.'])

    def test_rate_blank(self):
        errors = self._post_and_return_errors(rate='')
        self.assertSequenceEqual(errors, ['A valid number is required.'])

    def test_rate_not_a_number(self):
        errors = self._post_and_return_errors(rate='abc')
        self.assertSequenceEqual(errors, ['A valid number is required.'])

    def test_type_not_available(self):
        errors = self._post_and_return_errors(type='abc')
        self.assertSequenceEqual(errors, ['"abc" is not a valid choice.'])

    def _post_and_return_errors(self, **kwargs):
        valid_data = {'code': 'BRL', 'rate': 5.321}
        data = dict(valid_data, **kwargs)
        response = self.client.post(reverse('currency-list'), data)
        key = tuple(kwargs)[0]
        return response.json().get(key)


class CurrencyListPutInvalidViewTest(APITestCase):
    def setUp(self):
        self.valid_data = {'code': 'BRL', 'rate': 5.321}
        self.currency = Currency.objects.create(**self.valid_data)

    def test_code_blank(self):
        errors = self._put_and_return_errors(code='')
        self.assertSequenceEqual(errors, ['This field may not be blank.'])

    def test_rate_blank(self):
        errors = self._put_and_return_errors(rate='')
        self.assertSequenceEqual(errors, ['A valid number is required.'])

    def test_rate_not_a_number(self):
        errors = self._put_and_return_errors(rate='abc')
        self.assertSequenceEqual(errors, ['A valid number is required.'])

    def test_type_not_available(self):
        errors = self._put_and_return_errors(type='abc')
        self.assertSequenceEqual(errors, ['"abc" is not a valid choice.'])

    def _put_and_return_errors(self, **kwargs):
        data = dict(self.valid_data, **kwargs)
        response = self.client.put(
            reverse('currency-detail', args=[self.currency.pk]), data)
        key = tuple(kwargs)[0]
        return response.json().get(key)

