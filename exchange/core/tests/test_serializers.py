from django.test import TestCase

from exchange.core.models import Currency
from exchange.core.serializers import CurrencySerializer


class CurrencySerializerFieldsTest(TestCase):
    def test_fields(self):
        currency = Currency.objects.create(code='brl', rate=5.321)
        serializer = CurrencySerializer(instance=currency)

        self.assertSequenceEqual(
            set(serializer.data),
            set(['pk', 'code', 'backed_to', 'rate', 'type', 'updated_at']))


class CurrencySerializerCreate(TestCase):
    def setUp(self):
        self.currency = CurrencySerializer().create(
            {'code': 'brl', 'backed_to': 'usd', 'rate': 5.321})

    def test_create(self):
        self.assertTrue(Currency.objects.exists())

    def test_instance(self):
        self.assertIsInstance(self.currency, Currency)

    def test_code_uppercase(self):
        self.assertEqual('BRL', self.currency.code)

    def test_backed_to_uppercase(self):
        self.assertEqual('USD', self.currency.backed_to)


class CurrencySerializerUpdate(TestCase):
    def setUp(self):
        self.currency = CurrencySerializer().create(
            {'code': 'brl', 'backed_to': 'usd', 'rate': 5.321})

        self.currency = CurrencySerializer().update(
            self.currency, {'code': 'btc', 'backed_to': 'brl', 'rate': 1.0})

    def test_update(self):
        self.assertTrue(Currency.objects.exists())

    def test_instance(self):
        self.assertIsInstance(self.currency, Currency)

    def test_code(self):
        self.assertEqual('BTC', self.currency.code)

    def test_backed_to(self):
        self.assertEqual('BRL', self.currency.backed_to)

    def test_rate(self):
        self.assertEqual(1.0, self.currency.rate)
