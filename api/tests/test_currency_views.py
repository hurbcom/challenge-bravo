import json
import unittest

from api.app import app, redisConnector


class TestCurrenciesView(unittest.TestCase):
    url = '/currencies/'
    test_app = app.test_client()

    def setUp(self):
        self.redis = redisConnector
        self.redis.hset('currencies', 'USD', 1)
        self.redis.hset('currencies', 'BRL', 5.15)

    def test_put_convert_should_return_not_implemented(self):
        response = self.test_app.put(self.url)
        self.assertEqual(response.status_code, 405)

    def test_delete_convert_should_return_not_implemented(self):
        response = self.test_app.delete(self.url)
        self.assertEqual(response.status_code, 405)

    def test_get_convert_should_return_ok(self):
        response = self.test_app.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_get_convert_should_return_json(self):
        response = self.test_app.get(self.url)
        self.assertEqual(response.content_type, 'application/json')

    def test_get_convert_should_return_default_conversion(self):
        response = self.test_app.get(self.url)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data, {
            'count': 2,
            'results': [
                {
                    'id': 'USD',
                    'rate': 1
                }, {
                    'id': 'BRL',
                    'rate': 5.15
                }
            ]
        })