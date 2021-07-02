from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from coin.api.CoinSerializer import CoinSerializer
from core.api.CoreViewSets import CoreViewSets
from coin.service.CoinService import CoinService
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class CointViewSet(CoreViewSets):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._coin_service = CoinService()

    page = openapi.Parameter('page', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING, description='Pagina')
    size = openapi.Parameter('size', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING, description='Quantidade')
    @swagger_auto_schema(manual_parameters=[page, size])
    @action(methods=['get'], detail=True, url_path='page')
    def list(self, request):
        try:
            res = self._coin_service.list(request)
            return res
        except Exception as erro:
            raise APIException('Erro ao listar, verificque os parametros de paginação.')

    @swagger_auto_schema(responses={200: CoinSerializer(many=True)})
    @action(methods=['post'], detail=True)
    def create(self, request):
        try:
            res = self._coin_service.create(request)
            return Response({'msg': 'Sucesso'}, status=status.HTTP_200_OK)
        except Exception as error:
            raise APIException('Erro ao criar')

    @action(methods=['put'], detail=True)
    def update(self, request, pk=None):
        try:
            self._coin_service.update_for_pk(request, pk)
            return Response({'msg': 'Sucesso'}, status=status.HTTP_200_OK)
        except Exception as e:
            raise APIException('Erro ao atualizar.')

    @action(methods=['put'], detail=True)
    def update_all_coin(self, request):
        try:
            res = self._coin_service.update_all_coin(request)
            return Response(res)
        except Exception as e:
            raise APIException('Erro ao atualizar')

    @action(methods=['delete'], detail=True)
    def delete(self, request, pk=None):
        res = self._coin_service.delete(pk)
        return Response({'Sucesso'}, status=status.HTTP_200_OK)