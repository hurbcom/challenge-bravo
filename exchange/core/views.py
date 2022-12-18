from django.conf import settings
from django.core.cache import cache
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response

from exchange.core.models import Currency
from exchange.core.validators import QueryParamsValidator
from exchange.core.serializers import CurrencySerializer

from exchange.core.serializers import (
    CurrencySerializer,
    ConvertCurrencySerializer,
    QueryParamsErrorSerializer,
    Http404Serializer,)


class CurrencyModelViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer


class ConvertCurrencyGenericViewSet(viewsets.GenericViewSet):
    def list(self, request):
        query_params = QueryParamsValidator(request.query_params)

        if not query_params.is_valid():
            response = QueryParamsErrorSerializer(query_params).data
            return Response(response, status=400)

        try:
            cache_key = f'{query_params.from_}.{query_params.to}.{query_params.amount}'
            if response := cache.get(cache_key):
                return Response(response)

            from_ = get_object_or_404(Currency, code=query_params.from_.upper())
            to = get_object_or_404(Currency, code=query_params.to.upper())

            converted_amount = self.convert_currency(from_, to, query_params.amount)

            response = ConvertCurrencySerializer({
                'from_': from_.code,
                'to': to.code,
                'amount': query_params.amount,
                'rates': [{from_.code: from_.rate}, {to.code: to.rate}],
                'converted_amount': round(converted_amount, 2),
            }).data

            cache.set(cache_key, response, settings.CACHE_TIMEOUT_IN_SECONDS)
            return Response(response)

        except Http404:
            response = Http404Serializer(query_params).data
            return Response(response, 404)

    @staticmethod
    def convert_currency(source, destination, amount):
        if source.rate != destination.rate:
            source.convert_currency_rate_to_usd()
            destination.convert_currency_rate_to_usd()

        amount_in_usd = amount / source.rate
        return amount_in_usd * destination.rate
