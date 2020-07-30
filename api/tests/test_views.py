import json
import unittest

from api.app import app


class TestExchangeView(unittest.TestCase):
    url = '/convert/'
    test_app = app.test_client()

    def test_put_exchange_should_return_not_implemented(self):
        response = self.test_app.put(self.url)
        self.assertEqual(response.status_code, 405)

    def test_post_exchange_should_return_not_implemented(self):
        response = self.test_app.post(self.url)
        self.assertEqual(response.status_code, 405)

    def test_delete_exchange_should_return_not_implemented(self):
        response = self.test_app.delete(self.url)
        self.assertEqual(response.status_code, 405)

    def test_get_exchange_should_return_ok(self):
        response = self.test_app.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_get_exchange_should_return_json(self):
        response = self.test_app.get(self.url)
        self.assertEqual(response.content_type, 'application/json')

    def test_get_exchange_should_return_default_exchange(self):
        response = self.test_app.get(self.url)
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data, {
            'from': 'USD',
            'to': 'BRL',
            'amount': '1',
            'value': '5,15'
        })