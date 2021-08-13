from rest_framework import viewsets, status
from django_filters import rest_framework as filters
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import MyCoin
from .serializers import MyCoinSerializer, ConvertSerializer
from backend.services import ApiCoin, Convert


class MyCoinViewSet(viewsets.ModelViewSet):
    queryset = MyCoin.objects.all()
    serializer_class = MyCoinSerializer
    filter_backends = (filters.DjangoFilterBackend,)

    @action(detail=False, methods=['get'], serializer_class=ConvertSerializer)
    def convert(self, request):
        from_coin = request.query_params.get('from')
        to_coin = request.query_params.get('to')
        amount = float(request.query_params.get('amount', '1'))

        apicoin = ApiCoin()
        convert = apicoin.set_convert(from_coin, to_coin)

        if convert:
            value_convert = (amount * convert[f'{from_coin}_{to_coin}'])
            convert_obj = Convert(
                from_coin=from_coin, to_coin=to_coin, amount=value_convert
            )
            serializer = self.get_serializer(convert_obj)
            return Response(serializer.data)

        return Response(status=status.HTTP_400_BAD_REQUEST)
