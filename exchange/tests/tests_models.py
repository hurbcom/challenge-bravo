from django.test import TestCase
from exchange.models import Coin


class CoinModelTestCase(TestCase):
    def setUp(self):
        self.coin = Coin.objects.create(name="USD")

    def test_verify_attributes_of_coin(self):
        """Test that verify the attributes of one program"""
        self.assertEqual(self.coin.name, "USD")
