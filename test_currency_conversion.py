import unittest
from currency_conversion import CurrencyConversion


class TestCurrencyConversion(unittest.TestCase):

    def test_usd_brl(self):
        currency_conversion = CurrencyConversion('USD', 'BRL', 1)
        value = currency_conversion.conversion()
        self.assertEqual(value, 3.2781)

    def test_usd_eth(self):
        currency_conversion = CurrencyConversion('USD', 'ETH', 1)
        value = currency_conversion.conversion()
        self.assertEqual(value, 303.21)

    def test_usd_eur(self):
        currency_conversion = CurrencyConversion('USD', 'EUR', 1)
        value = currency_conversion.conversion()
        self.assertEqual(value, 0.8576)

    def test_eur_brl(self):
        currency_conversion = CurrencyConversion('EUR', 'BRL', 1)
        value = currency_conversion.conversion()
        self.assertEqual(value, 0.2616)

    def test_brl_eur(self):
        currency_conversion = CurrencyConversion('BRL', 'EUR', 1)
        value = currency_conversion.conversion()
        self.assertEqual(value, 3.8224)

    def test_brl_usd(self):
        currency_conversion = CurrencyConversion('BRL', 'USD', 1)
        value = currency_conversion.conversion()
        self.assertEqual(value, 0.3051)


if __name__ == '__main__':
    unittest.main()
