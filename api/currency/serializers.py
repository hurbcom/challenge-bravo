from rest_framework import serializers

from .models import Currency, CurrencyExchange


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ('iso_code', 'name', 'territory')


class CurrencyExchangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrencyExchange
        fields = ('id', 'iso_code_from', 'iso_code_to', 'exchange_rate')


class CalculateCurrencyExchangeRequestSerializer(serializers.Serializer):
    from_ = serializers.CharField()
    to = serializers.CharField()
    amount = serializers.FloatField()


class CalculateCurrencyExchangeDtoSerializer(serializers.Serializer):
    currency_from = serializers.CharField()
    currency_to = serializers.CharField()
    exchange_rate = serializers.FloatField()
    amount = serializers.FloatField()
    exchange_value = serializers.FloatField()
