from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from currency.api.serializer import FictionalCurrencySerializer
from currency.converters import get_currency_conversion_data
from currency.errors import CurrencyUnknownError
from currency.models import FictionalCurrency, OfficialCurrency


class ConvertCurrencyViewSet(APIView):
    def get(self, request) -> Response:
        amount = request.GET.get('amount')
        currency_from = request.GET.get('from')
        currency_to = request.GET.get('to')

        if not currency_from or not currency_to:
            return Response({}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        try:
            currency_from = FictionalCurrency.get_currency_base_data(currency_from.upper())
        except CurrencyUnknownError:
            return Response(
                {'message': f'Currency "{currency_from}" is not valid'},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        try:
            currency_to = FictionalCurrency.get_currency_base_data(currency_to.upper())
        except CurrencyUnknownError:
            return Response(
                {'message': f'Currency "{currency_to}" is not valid'},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

        converted_value = get_currency_conversion_data(float(amount), currency_from, currency_to)

        return Response(round(converted_value, 2))


class FictionalCurrenciesView(APIView):
    def get(self, request) -> Response:
        currencies = FictionalCurrency.objects.all()
        serializer = FictionalCurrencySerializer(currencies, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

class OfficialCurrenciesView(APIView):
    def get(self, request) -> Response:
        return Response(OfficialCurrency.all(), status=status.HTTP_200_OK)

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
