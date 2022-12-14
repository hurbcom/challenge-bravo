from rest_framework import viewsets

from exchange.core.models import Currency
from exchange.core.serializers import CurrencySerializer


class CurrencyModelViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
