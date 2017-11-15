from currency_conversion import app
import unittest
import requests
from currency_conversion.api.conversion import Conversion


class TestUnitConversion(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()

        self.headers = {
            'content-type': 'application/json'
        }

        self.data = {
            "data": {
                "amount": 1,
                "converted_amount": 3.2508,
                "from": {
                    "coin": "USD",
                    "quote": 3.2508
                },
                "to": {
                    "coin": "BRL",
                    "quote": 334.1
                }
            }
        }

    def test_request_response_200(self):
        response = self.client.get(
            '/api/conversion?from=USD&to=BRL&amount=1')
        self.assertEqual(response.status_code, 200)

    def test_passing_the_amount_as_a_string(self):
        response = self.client.get(
            '/api/conversion?from=USD&to=BRL&amount=test')
        self.assertEqual(response.status_code, 400)

    def test_missing_parameters(self):
        response = self.client.get(
            '/api/conversion?from=USD&to=BRL')
        self.assertEqual(response.status_code, 400)

