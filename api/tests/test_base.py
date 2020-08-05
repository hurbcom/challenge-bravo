import unittest

from unittest.mock import patch

from api.app import app, Redis

OPEN_EXCHANGE_PATH = 'api.models.OpenExchangeApi.get_currency_rate'


def mock_currency_rate(currency):
    currencies = {
        'USD': 1.00,
        'BRL': 5.15,
        'EUR': 1.00
    }

    return currencies.get(currency)


class TestBase(unittest.TestCase):
    test_app = app.test_client()

    def setUp(self):
        Redis.hset('currencies', 'USD', 1)
        Redis.hset('currencies', 'BRL', 1)

        self.patcher = patch(
            OPEN_EXCHANGE_PATH,
            side_effect=mock_currency_rate
        )
        self.patcher.start()

    def tearDown(self):
        Redis.delete('currencies')
        self.patcher.stop()