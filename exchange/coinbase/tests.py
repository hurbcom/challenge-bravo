from rest_framework.test import APITestCase

from exchange.coinbase.views import CoinbaseAPIView
from exchange.core.models import Currency


class CoinbaseAPIViewTest(APITestCase):
    def test_coinbase_updater(self):
        Currency.objects.create(code='BRL', rate=5.321)
        CoinbaseAPIView().coinbase_updater()

        currency = Currency.objects.get(code='BRL')
        self.assertNotEqual(5.321, currency.rate)

