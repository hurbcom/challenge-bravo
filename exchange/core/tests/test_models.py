from django.test import TestCase

from exchange.core.models import Currency


class CurrencyModelTest(TestCase):
    def setUp(self):
        self.currency = Currency.objects.create(code='BRL', rate=5.321)

    def test_create(self):
        self.assertTrue(Currency.objects.exists())

    def test_type_is_fiat(self):
        self.assertEqual('fiat', self.currency.type)

    def test_backed_to_usd(self):
        self.assertEqual('USD', self.currency.backed_to)

    def test_updated_at_auto(self):
        self.assertTrue(self.currency.updated_at)

    def test_str(self):
        self.assertEqual('BRL', str(self.currency))
