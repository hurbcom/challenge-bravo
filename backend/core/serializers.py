from rest_framework import serializers

from .models import MyCoin


class MyCoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyCoin
        fields = ('codecoin', 'namecoin', 'price')


class ConvertSerializer(serializers.Serializer):
    _from_coin = serializers.CharField()
    _to_coin = serializers.CharField()
    _amount = serializers.FloatField()
