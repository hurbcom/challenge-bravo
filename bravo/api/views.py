from rest_framework.renderers import JSONRenderer
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import date
from .models import Moedas, Cotacao
from decimal import *
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

        return Response(resultado)

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

        if tempo_ultima_att.days > 1:
            
            resultado = buscarCotacao(from_currency, to_currency, amount, id_from_currency, id_to_currency)
            
            return resultado
        else:
            return Decimal(amount) * ultima_cotacao.cotacao
    else:

        resultado = buscarCotacao(from_currency, to_currency, amount, id_from_currency, id_to_currency)

    return resultado

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
    modelo.cotacao = json['info']['rate']
    modelo.ultima_atualizacao = json['date']
    modelo.save()

    return modelo


def buscarCotacao(from_currency, to_currency, amount, id_from_currency, id_to_currency):
    
    cotacao_atual = requests.get('https://api.exchangerate.host/convert?from=' + from_currency + '&to='+ to_currency + '&amount=' + amount)

    json_cotacao = json.loads(cotacao_atual.content.decode("utf-8"))

    if json_cotacao['result'] == None:
        cotacao_crypto_atual = requests.get('https://api.exchangerate.host/convert?from=' + from_currency + '&to='+ to_currency + '&amount=' + amount +'&source=crypto')
        
        json_crypto_cotacao = json.loads(cotacao_atual.content.decode("utf-8"))
        
        if json_crypto_cotacao['result'] == None:
            return {'Error':'Conversão não pode ser realizada, tente com outras moedas'}
        else:
            gravarCotacao(id_from_currency, id_to_currency, json_crypto_cotacao)
            return json_crypto_cotacao['result'] 
    else:
        gravarCotacao(id_from_currency, id_to_currency, json_cotacao)
        
        return json_cotacao['result']