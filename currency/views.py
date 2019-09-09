from django.http import Http404
from rest_framework.views import APIView

from .models import Currency
from .serializers import CurrencySerializer
from core.utils import CryptoCompareTest, JSONResponse

class CurrencyList(APIView):
    """
    Lista todas as moedas, ou cria uma nova moeda.
    """
    def get(self, request, format=None):
        """
        Lista moedas cadastradas.
        """
        currency = Currency.objects.all()
        serializer = CurrencySerializer(currency, many=True)
        return JSONResponse(serializer.data)
    
    def post(self, request, format=None):
        """
        Cadastra nova moedas.
        """
        serializer = CurrencySerializer(data=request.data)
        
        if serializer.is_valid():
            if CryptoCompareTest(request.data):
                serializer.save()
                return JSONResponse(serializer.data)
            return JSONResponse({"message":"Moeda %s não disponível para cadastro" % request.data['symbol']})
        return JSONResponse(serializer.errors)
        


class CurrencyDetail(APIView):
    """
    Obter ou remover uma moeda do cadastro.
    """
    def get_object(self, symbol):
        try:
            return Currency.objects.get(symbol=symbol.upper())
        except Currency.DoesNotExist:
            raise Http404

    def get(self, request, symbol, format=None):
        """
        Obtem moeda cadastrada.
        """
        currency = self.get_object(symbol)
        serializer = CurrencySerializer(currency)
        return JSONResponse(serializer.data)

    def delete(self, request, symbol, format=None):
        """
        Remove moeda cadastrada.
        """
        currency = self.get_object(symbol)
        currency.delete()
        return JSONResponse({"message":"Moeda %s removida com sucesso" % symbol})