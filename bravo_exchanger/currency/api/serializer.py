from rest_framework import serializers

from currency.models import FictionalCurrency


class FictionalCurrencySerializer(serializers.ModelSerializer):
    currency_backing = serializers.CharField()
    currency_short_name = serializers.CharField()
    currency_amount = serializers.FloatField()

    class Meta:
        fields = ('currency_backing', 'currency_amount', 'currency_short_name')
        model = FictionalCurrency
