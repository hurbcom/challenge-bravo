from unittest import TestCase
import requests

from app import HOST, PORT

URL_ADDRESS = f"http://{HOST}:{PORT}"


class KeepAliveTesting(TestCase):
    def test_keep_alive_currencies(self):
        req = requests.get(f"{URL_ADDRESS}/currencies")
        status_code = req.status_code
        self.assertEqual(first=status_code, second=200)

    def test_keep_alive_convert(self):
        req = requests.get(f"{URL_ADDRESS}/convert?from=BRL&to=EUR&amount=1")
        status_code = req.status_code
        self.assertEqual(first=status_code, second=200)