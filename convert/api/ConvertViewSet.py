from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from convert.service.ConvertService import ConvertService
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class ConvertViewSet(viewsets.ViewSet):


    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._coin_service = ConvertService()

    _from = openapi.Parameter('from', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING, description='De')
    to = openapi.Parameter('to', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING, description='Para')
    amount = openapi.Parameter('amount', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING, description='valor')
    @swagger_auto_schema(manual_parameters=[_from, to, amount])
    @action(methods=['get'], detail=True)
    def convert(self, request):
        try:
            res = self._coin_service.convert(request.query_params)
            if res == -1:
                return Response({'erro': 'Conversão não possível'})
            return Response(res)
        except Exception as erro:
            return Response({"Erro ao converter"}, status=status.HTTP_400_BAD_REQUEST)