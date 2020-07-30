import unittest

from api.app import app


class TestExchangeView(unittest.TestCase):
    url = '/exchange/'
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