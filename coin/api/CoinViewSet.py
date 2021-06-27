from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.api.CoreViewSets import CoreViewSets
from coin.service.CoinService import CoinService

class CointViewSet(CoreViewSets):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._coin_service = CoinService()

    @action(methods=['get'], detail=True)
    def list(self, request):
        try:
            res = self._coin_service.list(request)
            return Response(res, status=status.HTTP_200_OK)
        except Exception as erro:
            return Response({'erro ao salvar'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], detail=True)
    def create(self, request):
        try:
            res = self._coin_service.create(request)
            return Response(res, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({'Erro ao criar'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['put'], detail=True)
    def update(self, request, pk=None):
        try:
            res = self._coin_service.update(request, pk)
            return Response(res, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({'erro ao atualizar'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['put'], detail=True)
    def update_coin(self, request):
        try:
            res = self._coin_service.update_coin(request)
            return Response(res)
        except Exception as error:
            return Response({'erro ao atualizar'}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['delete'], detail=True)
    def delete(self, request, coin=None):
        try:
            res = self._coin_service.delete(coin)
            return Response({'Sucesso'}, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({'Erro ao deletar'}, status=status.HTTP_400_BAD_REQUEST)