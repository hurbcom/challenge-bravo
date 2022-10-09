from rest_framework.serializers import ModelSerializer

from currency.models import FictionalCurrency


class FictionalCurrencySerializer(ModelSerializer):
    class Meta:
        model = FictionalCurrency
        fields = (
            'currency_backing',
            'created_at',
            'currency_amount',
            'currency_short_name',
            'updated_at'
        )
