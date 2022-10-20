from rest_framework import serializers
from .models import Coin
from .validators import name_valide


class CoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coin
        fields = "__all__"

    def validate(self, data):
        if not name_valide(data["name"]):
            raise serializers.ValidationError({"name": "Name is invalid!"})
        return data
