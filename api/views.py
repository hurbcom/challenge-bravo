import json
from decimal import Decimal

from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import ReadOnlyModelViewSet

from api.serializers import CurrencySerializer
from core.models import Currency


class CurrencyViewSet(ReadOnlyModelViewSet):
    serializer_class = CurrencySerializer
    queryset = Currency.objects.all()
    lookup_field = 'symbol'

    @action(
        detail=True,
        methods=['GET'],
        url_path='(?P<amount>[^/.]+)/to/(?P<destiny_symbol>[^/.]+)',
    )
    def to(self, request, amount, destiny_symbol, symbol=None):
        amount = Decimal(amount)
        currency = self.get_object()
        destiny_value = currency.to(amount, destiny_symbol)
        data = {'value': str(destiny_value)}
        return HttpResponse(
            content=json.dumps(data),
            content_type='application/json',
            status=status.HTTP_200_OK
        )
