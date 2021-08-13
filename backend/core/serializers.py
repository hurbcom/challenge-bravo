from rest_framework import serializers

from .models import MyCoin


class MyCoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyCoin
        fields = ('codecoin', 'namecoin', 'price')
