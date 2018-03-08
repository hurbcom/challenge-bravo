import requests
import unittest


class TestUnitResponses(unittest.TestCase):
    def setUp(self):
        self.requests = requests

    def test_response_ok(self):
        response = self.requests.get(
            'http://localhost:8888/converter/?from=USD&to=EUR&amount=23')
        self.assertEqual(response.status_code, 200)

    def test_amount_invalid(self):
        response = self.requests.get(
            'http://localhost:8888/converter/?from=USD&to=EUR&amount=lol')
        self.assertEqual(response.status_code, 422)

    def test_missing_parameters(self):
        response = self.requests.get(
            'http://localhost:8888/converter/?from=USD&amount=2')
        self.assertEqual(response.status_code, 422)

    def test_non_currency(self):
        response = self.requests.get(
            'http://localhost:8888/converter/?from=LOL&to=BRL&amount=1')
        self.assertEqual(response.status_code, 400)
    
    def test_content_type(self):
        response = self.requests.get(
            'http://localhost:8888/converter/?from=USD&to=BRL&amount=1')
        self.assertEqual(response.headers['content-type'], 'application/json')

