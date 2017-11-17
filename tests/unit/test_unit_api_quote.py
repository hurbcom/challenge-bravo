import unittest
import requests


class TestUnitApiQuote(unittest.TestCase):

    BRL_EUR = 'http://api.fixer.io/latest?base=USD'
    ETH = 'https://cex.io/api/last_price/ETH/USD'
    BTC = 'https://cex.io/api/last_price/BTC/USD'

    def test_get_200(self):
        api_eur_brl = self.BRL_EUR
        response_eur_brl = requests.get(api_eur_brl)

        api_eth = self.ETH
        response_eth = requests.get(api_eth)

        api_btc = self.ETH
        response_btc = requests.get(api_btc)

        self.assertEqual(response_eur_brl.status_code, 200)
        self.assertEqual(response_eth.status_code, 200)
        self.assertEqual(response_btc.status_code, 200)
