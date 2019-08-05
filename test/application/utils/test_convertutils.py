import unittest
from decimal import Decimal

from src.application.utils.convertutils import calculateExchange

class ConverUtilsTests(unittest.TestCase):
    def test_usd_brl(self):
        quotes = {'USDUSD': 1,'USDBRL': 3.89,'USDEUR': 0.9,'USDBTC': 0.000088,'USDETH': 0.0044}
        from_ = 'USD'
        to = 'BRL'
        amount = 10
        expected = Decimal(38.9).quantize(Decimal(10) ** -6)

        result = calculateExchange(amount, from_, to, quotes)

        self.assertEqual(result, expected)

    def test_brl_usd(self):
        quotes = {'USDUSD': 1,'USDBRL': 3.89,'USDEUR': 0.9,'USDBTC': 0.000088,'USDETH': 0.0044}
        from_ = 'BRL'
        to = 'USD'
        amount = 10
        expected = Decimal(2.570694).quantize(Decimal(10) ** -6)

        result = calculateExchange(amount, from_, to, quotes)

        self.assertEqual(result, expected)
    
    def test_brl_btc(self):
        quotes = {'USDUSD': 1,'USDBRL': 3.89,'USDEUR': 0.9,'USDBTC': 0.000088,'USDETH': 0.0044}
        from_ = 'BRL'
        to = 'BTC'
        amount = 10
        expected = Decimal(0.000226).quantize(Decimal(10) ** -6)

        result = calculateExchange(amount, from_, to, quotes)

        self.assertEqual(result, expected)