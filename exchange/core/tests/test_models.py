from django.test import TestCase

from exchange.core.models import Currency
from exchange.core.managers import CoinbaseManager


class CurrencyModelTest(TestCase):
    def setUp(self):
        """Creates a currency for all tests"""
        self.currency = Currency.objects.create(code='BRL', rate=5.321)

    def test_create(self):
        """Currency objects must exists"""
        self.assertTrue(Currency.objects.exists())

    def test_type_is_fiat(self):
        """Currency `type` default must be FIAT"""
        self.assertEqual('fiat', self.currency.type)

    def test_backed_to_usd(self):
        """Currency `backed_to` must be USD"""
        self.assertEqual('USD', self.currency.backed_to)

    def test_updated_at_auto(self):
        """Currency `updated_at` must be `auto_now`"""
        self.assertTrue(self.currency.updated_at)

    def test_str(self):
        self.assertEqual('BRL', str(self.currency))

    def test_manager(self):
        """Currency.objects must be instance of CoinbaseManager"""
        self.assertIsInstance(Currency.objects, CoinbaseManager)

    def test_convert_currency_rate_to_usd(self):
        """Method Currency.convert_currency_rate_to_usd must be 2.1"""
        Currency.objects.create(code='EUR', rate=0.9321)
        currency = Currency.objects.create(code='HURB', backed_to='EUR', rate=2.1)
        currency.convert_currency_rate_to_usd()

        self.assertNotEqual(2.1, currency.rate)
