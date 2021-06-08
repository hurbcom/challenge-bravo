from rest_framework import serializers
from coin.models import Coin


class CoinSerializer(serializers.Serializer):
    code = serializers.CharField(required=True, max_length=10)
    name = serializers.CharField(required=True, max_length=30)
    value = serializers.DecimalField(
        required=True, min_value=0, decimal_places=8, max_digits=10)

    def validate_code(self, code: str):
        _code = code.upper()
        if Coin.objects.filter(code__iexact=_code).exists():
            raise serializers.ValidationError("This code already exists")
        return _code

    def create(self, validated_data):
        """
        Create and return a new `Coin` instance, given the validated data.
        """
        return Coin.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Coin` instance, given the validated data.
        """
        instance.code = validated_data.get('code', instance.code)
        instance.name = validated_data.get('name', instance.name)
        instance.value = validated_data.get('value', instance.value)
        instance.save()
        return instance
