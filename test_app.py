import app
import unittest

# python -m unittest test_app

class TestMyApp(unittest.TestCase):
    def setUp(self):
        self.app = app.app.test_client()

    def test_url_without_params(self):
        """
        Tests the response to a url without params
        """
        rv = self.app.get('/currency')
        assert rv.status == '400 BAD REQUEST'

    def test_url_with_wrong_from_currency(self):
        """
        Tests the response to a url with wrong FROM_CURRENCY
        """
        rv = self.app.get('/currency?from=BLA&to=BTC&amount=1')
        assert rv.status == '400 BAD REQUEST'
    
    def test_url_with_wrong_to_currency(self):
        """
        Tests the response to a url with wrong TO_CURRENCY
        """
        rv = self.app.get('/currency?from=BRL&to=BIT&amount=1')
        assert rv.status == '400 BAD REQUEST'

    def test_url_with_wrong_amount(self):
        """
        Tests the response to a url with wrong AMOUNT
        """
        rv = self.app.get('/currency?from=BRL&to=BTC&amount=-1')
        assert rv.status == '400 BAD REQUEST'

    def test_404(self):
        rv = self.app.get('/other')
        self.assertEqual(rv.status, '404 NOT FOUND')

    def test_url_ok(self):
        rv = self.app.get('/currency?from=BRL&to=BTC&amount=1')
        self.assertEqual(rv.status, '200 OK')

if __name__ == '__main__':
    unittest.main()