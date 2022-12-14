from rest_framework import serializers

from exchange.core.models import Currency


class CurrencySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Currency
        fields = ['pk', 'code', 'backed_to', 'rate', 'type', 'updated_at']

    def create(self, validated_data):
        validated_data['code'] = validated_data.get('code').upper()
        validated_data['backed_to'] = validated_data.get('backed_to', 'USD').upper()
        return Currency.objects.create(**validated_data)

    def update(self, instance, validated_data):
        super().update(instance, validated_data)
        instance.code = validated_data.get('code', instance.code).upper()
        instance.backed_to = validated_data.get('backed_to', instance.backed_to).upper()
        instance.save()
        return instance
