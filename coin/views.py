from rest_framework import status, viewsets
from .serializers import CoinSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from decimal import Decimal
from .models import Coin


class CoinViewSet(viewsets.ModelViewSet):
    queryset = Coin.objects.all()
    serializer_class = CoinSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.code == 'USD':
            data = {'error': "You can't delete USD coin"}
            return Response(status=status.HTTP_400_BAD_REQUEST, data=data)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['GET'], detail=False, url_path='convert', url_name='convert')
    def convert(self, request):
        query_params_keys = list(request.query_params.keys())
        query_params_keys.sort()
        if query_params_keys == ['amount', 'from', 'to']:
            to = request.query_params.get('to').upper()
            _from = request.query_params.get('from').upper()
            amount = request.query_params.get('amount')

            if not Coin.objects.filter(code__iexact=_from).exists():
                return Response({'Error': f"Coin '{_from}' not exist"}, status=status.HTTP_400_BAD_REQUEST)

            if not Coin.objects.filter(code__iexact=to).exists():
                return Response({'Error': f"Coin '{to}' not exist"}, status=status.HTTP_400_BAD_REQUEST)

            data_from = Coin.objects.filter(code__iexact=_from).get()
            to = Coin.objects.filter(code__iexact=to).get()

            dolar_value = Decimal(amount) / data_from.value
            to_coin_value: Decimal = dolar_value * to.value

            return Response({to.code: to_coin_value}, status=status.HTTP_200_OK)
