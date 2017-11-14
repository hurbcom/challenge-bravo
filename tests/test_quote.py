import unittest
from currency_conversion.quote import Quote


class TestQuote(unittest.TestCase):

    def test_usd_brl(self):
        quote = Quote('USD', 'BRL')
        value = quote.get()
        self.assertEqual(value, 3.2781)

    def test_usd_eth(self):
        quote = Quote('USD', 'ETH')
        value = quote.get()
        self.assertEqual(value, 303.21)

    def test_usd_eur(self):
        quote = Quote('USD', 'EUR')
        value = quote.get()
        self.assertEqual(value, 0.8576)

    def test_eur_brl(self):
        quote = Quote('EUR', 'BRL')
        value = quote.get()
        self.assertEqual(value, 0.2616)

    def test_brl_eur(self):
        quote = Quote('BRL', 'EUR')
        value = quote.get()
        self.assertEqual(value, 3.8224)

    def test_brl_usd(self):
        quote = Quote('BRL', 'USD')
        value = quote.get()
        self.assertEqual(value, 0.3051)


if __name__ == '__main__':
    unittest.main()
