from rest_framework.views import APIView
from django.db.models import Q
from currency.models import Currency
from core.utils import Normalize, CryptoCompare, JSONResponse

class Converter(APIView):
    """
    Conversor de moedas (Requer parametros para conversão. Ex: ?from=BTC&to=EUR&amount=123.45)
    """
    def get(self, request, format=None):
        if not request.GET.get('to') or not request.GET.get('from') or not request.GET.get('amount'):
            return JSONResponse({"message":"Parâmetros inválidos!"})


        data = Normalize(request)
        qs = Currency.objects.filter(Q(symbol=data['from']) | Q(symbol=data['to']))
        
        if qs.count() == 2:
            result = CryptoCompare(data)
            
            shortname_from = qs.get(symbol=data['from']).shortname
            shortname_to = qs.get(symbol=data['to']).shortname

            context = {
                "message": "Resultado da conversão de moedas",
                "from": data['from'],
                "to": data['to'],
                "amount": "%s %s" % (shortname_from, data['amount']),
                "currency": "%s %s" % (shortname_to, result['result'])
            }
            return JSONResponse(context)
        else:
            return JSONResponse({"message":"Moeda não disponível para conversão"})
