from currency_conversion import app
import unittest


class TestUnitConversion(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()

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

    def test_return_json(self):
        response = self.client.get(
            '/api/conversion?from=USD&to=BRL')
        self.assertEqual(response.headers['content-type'], 'application/json')
