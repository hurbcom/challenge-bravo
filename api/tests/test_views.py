import json
import unittest

from api.app import app


class TestConvertView(unittest.TestCase):
    url = '/convert/'
    test_app = app.test_client()

    def test_put_convert_should_return_not_implemented(self):
        response = self.test_app.put(self.url)
        self.assertEqual(response.status_code, 405)

    def test_post_convert_should_return_not_implemented(self):
        response = self.test_app.post(self.url)
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
            'from': 'USD',
            'to': 'BRL',
            'amount': 1,
            'value': 5.15
        })

    def test_get_convert_should_return_conversion_sended_by_get(self):
        response = self.test_app.get(self.url, query_string={
            'from': 'BRL',
            'to': 'USD',
            'amount': 1
        })
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data, {
            'from': 'BRL',
            'to': 'USD',
            'amount': 1,
            'value': 0.19
        })