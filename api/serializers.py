from rest_framework import serializers

from core.models import Currency


class CurrencySerializer(serializers.ModelSerializer):

    class Meta:
        model = Currency
        fields = (
            'symbol',
            'is_base',
            'value',
            'last_updated',
        )