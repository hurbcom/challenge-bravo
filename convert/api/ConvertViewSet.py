from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from convert.service.ConvertService import ConvertService

class ConvertViewSet(viewsets.ViewSet):

    lastro = 'USD'

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._coin_service = ConvertService()

    @action(methods=['get'], detail=True)
    def convert(self, request):
        try:
            res = self._coin_service.convert(request.query_params)
            return Response(res)
        except Exception as erro:
            return Response({"Erro ao salvar"}, status=status.HTTP_400_BAD_REQUEST)