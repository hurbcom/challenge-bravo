from rest_framework import serializers

from exchange.core.models import Currency


class CurrencySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Currency
        fields = ['pk', 'code', 'backed_to', 'rate', 'type', 'updated_at']

    def create(self, validated_data):
        # Adds two behaviors to the method for uppercase.
        validated_data['code'] = validated_data.get('code').upper()
        validated_data['backed_to'] = validated_data.get('backed_to', 'USD').upper()

        return Currency.objects.create(**validated_data)

    def update(self, instance, validated_data):
        super().update(instance, validated_data)

        # Adds two behaviors to the method for uppercase.
        instance.code = validated_data.get('code', instance.code).upper()
        instance.backed_to = validated_data.get('backed_to', instance.backed_to).upper()

        instance.save()
        return instance


class BaseSerializer(serializers.Serializer):
    from_ = serializers.CharField()
    to = serializers.CharField()


class ConvertCurrencySerializer(BaseSerializer):
    amount = serializers.FloatField()
    rates = serializers.ListField()
    converted_amount = serializers.FloatField()


class QueryParamsErrorSerializer(BaseSerializer):
    amount = serializers.CharField()
    errors = serializers.ListField()


class Http404Serializer(BaseSerializer):
    pass
