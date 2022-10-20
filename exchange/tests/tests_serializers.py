from django.test import TestCase
from exchange.models import Coin
from exchange.serializers import CoinSerializer


class CoinSerializerTestCase(TestCase):
    def setUp(self):
        self.coin = Coin.objects.create(name="EUR")
        self.serializer = CoinSerializer(instance=self.coin)

    def test_verify_fields_serialized(self):
        """Test that checks the fields being serialized"""
        data = self.serializer.data
        self.assertEquals(
            set(data.keys()), set(["id", "name", "created_at", "updated_at"])
        )
