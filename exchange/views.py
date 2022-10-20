import coreapi
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.filters import BaseFilterBackend
from rest_framework.permissions import IsAuthenticated
from .exchange import exchange
from .serializers import CoinSerializer
from .models import Coin


class SimpleFilterBackend(BaseFilterBackend):
    def get_schema_fields(self, view):
        return [
            coreapi.Field(name="from", location="query", required=True, type="string"),
            coreapi.Field(name="to", location="query", required=True, type="string"),
            coreapi.Field(
                name="amount", location="query", required=True, type="string"
            ),
        ]


class ExchangeCoinView(APIView):
    filter_backends = (SimpleFilterBackend,)

    def get(self, request, format=None):
        """
        It takes in a request, and returns a response

        :param from: The coin from conversion
        :param to: The coin to conversion
        :param amount: The amount to conversion
        :return: A dictionary with the conversion, amount, and exchange.
        """
        coin_from = request.query_params.get("from")
        coin_to = request.query_params.get("to")
        coin_amount = float(request.query_params.get("amount"))
        conversion = exchange(coin_from, coin_to, coin_amount)

        return Response(
            {
                "conversion": f"{coin_from} to {coin_to}",
                "amount": coin_amount,
                "exchange": conversion,
            }
        )


class CoinViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Coin.objects.all()
    serializer_class = CoinSerializer
