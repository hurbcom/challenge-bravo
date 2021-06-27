
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

class ConvertSerializer(ModelSerializer):


    class Meta:
        model = ''
        fields = (
            'id'
        )