from munch import Munch
from services.coin_cap import CoinCapService, Configuration, AVAILABLE_CURRENCIES_CODES, \
    VALUE_CACHE
from unittest.mock import patch
import unittest
import time

MOCK_CONFIG = {
    "CACHE_TIMEOUT_INT_SECONDS": 30
}
MOCK_RESPONSE = {
    "data": [
        {
            "symbol": "BTC",
            "name": "Bitcoin",
            "priceUsd": "6718.7423447707076630"
        },
        {
            "symbol": "ETH",
            "name": "Ethereum",
            "priceUsd": "137.8005014760846564"
        }
    ]
}


class MockResponse:
    def json(self):
        return MOCK_RESPONSE


class TestCurrencyRepository(unittest.TestCase):
    @classmethod
    @patch("os.environ", return_value=MOCK_CONFIG)
    @patch.object(CoinCapService,
                  "_request_to_api",
                  return_value=MockResponse())
    def setUpClass(cls, mock_response, mock_env):
        cls._service = CoinCapService()

    def test_init(self):
        self.assertEqual({
            c["symbol"]: c["name"].lower() for c in MOCK_RESPONSE["data"]
        }, AVAILABLE_CURRENCIES_CODES)
        self.assertEqual(len(MOCK_RESPONSE["data"]),
                         len(VALUE_CACHE["values"]))

    def test_converter(self):
        currency = MOCK_RESPONSE["data"][0]
        amount = 34864.21
        self.assertEqual(
            amount * float(currency["priceUsd"]),
            self._service.converter(Munch(code=currency["symbol"]),
                                    amount)
        )

    @patch.object(CoinCapService,
                  "_request_to_api")
    def test_load_cache(self, mock_response):
        # TODO: por que a env timeout está 1 segundo?
        time.sleep(1)
        self._service._load_cache()
        mock_response.assert_called_once()
