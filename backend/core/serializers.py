from rest_framework import serializers

from .models import MyCoin


class MyCoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyCoin
        fields = ('codecoin', 'namecoin', 'price')


class ConvertSerializer(serializers.Serializer):
    from_coin = serializers.CharField()
    to_coin = serializers.CharField()
    amount = serializers.FloatField()
