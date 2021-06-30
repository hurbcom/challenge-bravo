from rest_framework import serializers
from coin.model.CoinModel import CoinModel

class CoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoinModel
        fields = (
            'id',
            'price',
            'amount_coint_bslt',
            'coin',
            'coin_initials',
            'country',
            'country_initials',
            'bslt'
        )