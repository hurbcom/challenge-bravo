from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from coin.model.CoinModel import CoinModel

class CoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoinModel
        fields = (
            'id',
            'price',
            'coin',
            'coin_initials',
            'country',
            'country_initials',
            'bslt'
        )