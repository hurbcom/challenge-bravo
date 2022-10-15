from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from currency.api.serializer import FictionalCurrencySerializer
from currency.converters import get_currency_conversion_data
from currency.models import FictionalCurrency


class ConvertCurrencyViewSet(APIView):
    def get(self, request, amount: str, currency_from: str, currency_to: str) -> Response:
        if not currency_from or not currency_to:
            return Response({}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        currency_from = FictionalCurrency.get_currency_base_data(currency_from.upper())
        currency_to = FictionalCurrency.get_currency_base_data(currency_to.upper())

        converted_value = get_currency_conversion_data(float(amount), currency_from, currency_to)

        return Response(round(converted_value, 2))


class FictionalCurrenciesView(APIView):
    def get(self, request) -> Response:
        currencies = FictionalCurrency.objects.all()
        serializer = FictionalCurrencySerializer(currencies, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class FictionalCurrencyView(APIView):
    def delete(self, request, currency_short_name: str) -> Response:
        try:
            currency = FictionalCurrency.objects.get(currency_short_name=currency_short_name)
        except FictionalCurrency.DoesNotExist:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        currency.delete()

        return Response({}, status=status.HTTP_204_NO_CONTENT)

    def get(self, request, currency_short_name: str) -> Response:
        try:
            currency = FictionalCurrency.objects.get(currency_short_name=currency_short_name)
        except FictionalCurrency.DoesNotExist:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        serializer = FictionalCurrencySerializer(currency)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request) -> Response:
        serializer = FictionalCurrencySerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, currency_short_name: str) -> Response:
        try:
            currency = FictionalCurrency.objects.get(currency_short_name=currency_short_name)
        except FictionalCurrency.DoesNotExist:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        serializer = FictionalCurrencySerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.update(currency, serializer.validated_data)

        return Response(serializer.data, status=status.HTTP_200_OK)
