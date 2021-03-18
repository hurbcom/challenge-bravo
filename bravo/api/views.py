from rest_framework.renderers import JSONRenderer
from rest_framework import permissions, status
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

        #Pega parametros do usuário e inicia o processo de busca/conversão de moedas.

        from_currency = request.query_params['from']
        to_currency = request.query_params['to']
        amount_from = request.query_params['amount']
        
        resultado = converterMoedas(from_currency, to_currency, amount_from)

        return Response(resultado, status=status.HTTP_200_OK)

class GerenciarMoedasView(APIView):
    permission_classes = [permissions.AllowAny]
    renderer_classes = [JSONRenderer]

    def post(self, request):
        simbolo = request.data['simbolo']
        try:
        #Verifica pré existência da moeda enviada 
            Moedas.objects.get(simbolo=simbolo)
            return Response({'Erro':'Moeda já cadastrada'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            pass

        if simbolo:
            #Para o caso de simbolo não estar vazio é criado no banco a nova moeda
            moeda = Moedas.objects.create(simbolo=simbolo)
            return Response({'Sucesso':'Cadastrada com sucesso.'}, status=status.HTTP_201_CREATED)

        return Response({'Erro':'Simbolo não valido.'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        simbolo = request.data['simbolo']

        try:
            #Busca moeda sinalizada e e deleta caso ela esteja na base de dados
            localizado = Moedas.objects.get(simbolo=simbolo)
        except:
            return Response({'Erro':'Simbolo não encontrando na base de dados para deleção.'}, status=status.HTTP_400_BAD_REQUEST)

        if localizado:
            localizado.delete()
            return Response({'Sucesso':'Deletado com sucesso.'}, status=status.HTTP_200_OK)
        
        return Response({'Erro':'Simbolo não encontrando na base de dados para deleção.'}, status=status.HTTP_400_BAD_REQUEST)


def converterMoedas(from_currency, to_currency, amount):
    
    #Verifica moedas e devolve suas instancias do banco de dados
    id_from_currency = verificarMoeda(from_currency)

    id_to_currency = verificarMoeda(to_currency)

    #Verifica se existe cotação igual a pedida pelo usuário
    cotacao = Cotacao.objects.filter(moeda_para=id_to_currency, moeda_de=id_from_currency)


    if cotacao:
        
        #Se a cotação existe é verificado a validade do cambio,
        # sendo maior que 1 dia é feita nova requisição na API terceira

        hoje = date.today()
        ultima_cotacao = cotacao.latest('ultima_atualizacao')
        tempo_ultima_att = hoje - ultima_cotacao.ultima_atualizacao

        if tempo_ultima_att.days > 1:
            #Busca em caso de não estar valido
            resultado = buscarCotacao(from_currency, to_currency, amount, id_from_currency, id_to_currency)
            
            return resultado
        else:
            return Decimal(amount) * ultima_cotacao.cotacao
    else:

        resultado = buscarCotacao(from_currency, to_currency, amount, id_from_currency, id_to_currency)

    return resultado

def verificarMoeda(moeda):

    #Testa se moeda passada por usuário já existe no banco

    try:
        id_moeda = Moedas.objects.get(simbolo=moeda).id
    except Exception:
        return Response({'Erro':'Simbolo' + moeda + '(moeda) não cadastrada, cadastre primeiro pra fazer a busca'}, status=status.HTTP_400_BAD_REQUEST)

    return id_moeda

def gravarCotacao(id_from, id_to , json):
    
    #Grava no banco de dados o câmbio da conversão solicitada pelo usuário para diminuir a busca na API de terceiros.
    
    modelo = Cotacao()
    modelo.moeda_para = Moedas.objects.get(pk=id_to)
    modelo.moeda_de = Moedas.objects.get(pk=id_from)
    modelo.cotacao = json['info']['rate']
    modelo.ultima_atualizacao = json['date']
    modelo.save()
    
    return True


def buscarCotacao(from_currency, to_currency, amount, id_from_currency, id_to_currency):
    
    #Consulta a API de terceiros

    cotacao_atual = requests.get('https://api.exchangerate.host/convert?from=' + from_currency + '&to='+ to_currency + '&amount=' + amount)

    json_cotacao = json.loads(cotacao_atual.content.decode("utf-8"))

    #API de câmbio não retorna status negativo em caso de não localização, então é necessário verificar se existe resultado para conversão

    if json_cotacao['result'] == None:

        #Para crypto moedas é necessário mudar a fonte de busca na API de câmbio,
        # então é feita nova busca em caso de não localização usando a fonte normal

        cotacao_crypto_atual = requests.get('https://api.exchangerate.host/convert?from=' + from_currency + '&to='+ to_currency + '&amount=' + amount +'&source=crypto')
        
        json_crypto_cotacao = json.loads(cotacao_atual.content.decode("utf-8"))
        
        if json_crypto_cotacao['result'] == None:
            return Response({'Error':'Conversão não pode ser realizada, tente com outras moedas'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            gravarCotacao(id_from_currency, id_to_currency, json_crypto_cotacao)
            return json_crypto_cotacao['result'] 
    else:
        gravarCotacao(id_from_currency, id_to_currency, json_cotacao)
        
        return json_cotacao['result']