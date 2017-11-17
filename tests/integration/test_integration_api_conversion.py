import unittest
import requests
from currency_conversion.api.conversion import Conversion
from currency_conversion import app
import json


class GetJson:
    BRL_EUR = 'http://api.fixer.io/latest?base=USD'
    ETH_BTC = 'https://cex.io/api/last_price/{}/USD'

    def __init__(self):
        self.json_quotes = self.getJson()

    def getJson(self):
        json = {}
        get_json = requests.get(self.BRL_EUR)
        coin_json = get_json.json()
        json['BRL'] = self.format_quote(coin_json['rates']['BRL'])
        json['EUR'] = self.format_quote(coin_json['rates']['EUR'])

        get_json = requests.get(self.ETH_BTC.format('ETH'))
        coin_json = get_json.json()
        json['ETH'] = self.format_quote(float(coin_json['lprice']))

        get_json = requests.get(self.ETH_BTC.format('BTC'))
        coin_json = get_json.json()
        json['BTC'] = self.format_quote(float(coin_json['lprice']))

        return json

    def format_quote(self, quote):
        return float("{0:4.4f}".format(quote))

json_get = GetJson()

class TestIntegrationConversion(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()

    def test_usd_brl(self):
        response = self.client.get(
            '/api/conversion?from=USD&to=BRL&amount=1')
        response = json.loads(response.data.decode())
        self.assertEqual(response['data']['from']['quote'], json_get.json_quotes['BRL'])

    def test_eur_brl(self):
        response = self.client.get(
            '/api/conversion?from=EUR&to=BRL&amount=1')
        response = json.loads(response.data.decode())
        expected = float("{0:4.4f}".format(json_get.json_quotes['EUR'] / json_get.json_quotes['BRL']))
        self.assertEqual(response['data']['from']['quote'], expected)
