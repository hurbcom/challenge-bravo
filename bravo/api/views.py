from rest_framework.renderers import JSONRenderer
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import date
from .models import Moedas, Cotacao
import requests
import json

class ConverterView(APIView):
    
    permission_classes = [permissions.AllowAny]
    renderer_classes = [JSONRenderer]

    def get(self, request):
        from_currency = request.query_params['from']
        to_currency = request.query_params['to']
        amount_from = request.query_params['amount']
        
        resultado = converterMoedas(from_currency, to_currency, amount_from)

        return Response(amount_to)

class GerenciarMoedasView(APIView):
    permission_classes = [permissions.AllowAny]
    renderer_classes = [JSONRenderer]

    def post(self, request):
        return self

    def delete(self, request):
        return self


def converterMoedas(from_currency, to_currency, amount):
    
    id_from_currency = verificarMoeda(from_currency)

    id_to_currency = verificarMoeda(to_currency)

    cotacao = Cotacao.objects.filter(moeda_para=id_to_currency, moeda_de=id_from_currency)

    if cotacao:

        hoje = date.today()
        ultima_cotacao = cotacao.latest('ultima_atualizacao')
        tempo_ultima_att = hoje - ultima_cotacao.ultima_atualizacao

        if tempo_ultima_att.days > 30:
            cotacao_atual = requests.get('https://api.exchangeratesapi.io/latest?base=' + from_currency + '&symbols=' + to_currency)
            json_cotacao = json.loads(cotacao_atual.content.decode("utf-8"))

            gravarCotacao(id_from_currency, id_to_currency, json_cotacao)

            return amount * json_cotacao['rates'][to_currency]
        else:
            return amount * ultima_cotacao.cotacao
    else:
        cotacao_atual = requests.get('https://api.exchangeratesapi.io/latest?base=' + from_currency + '&symbols=' + to_currency)
        json_cotacao = json.loads(cotacao_atual.content.decode("utf-8"))

        gravarCotacao(id_from_currency, id_to_currency, json_cotacao)
        #TODO Acertar conversão
        return amount * json_cotacao['rates'][to_currency]

def verificarMoeda(moeda):
    try:
        id_moeda = Moedas.objects.get(simbolo=moeda).id
    except Exception:
        return {'resultado':'Simbolo' + moeda + '(moeda) não cadastrada, cadastre primeiro pra fazer a busca'}

    return id_moeda

def gravarCotacao(id_from, id_to , json):
    
    modelo = Cotacao()
    modelo.moeda_para = Moedas.objects.get(pk=id_to)
    modelo.moeda_de = Moedas.objects.get(pk=id_from)
    modelo.cotacao = json['rates'][Moedas.objects.get(pk=id_to).simbolo]
    modelo.ultima_atualizacao = json['date']
    modelo.save()

    return modelo