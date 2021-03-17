from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from .models import *
from .views import *

class GerenciarMoedasTestCase(TestCase):

    def setUp(self):
        Moedas.objects.create(simbolo='ZWB')
        self.url = reverse('gerenciar-moedas')

    def test_valid_post(self):
        
        client = APIClient()
        response = client.post(self.url, {"simbolo":"KRW"}, format='json')

        self.assertEqual(response.status_code, 201)
    
    def test_invalid_post(self):
        
        client = APIClient()
        response = client.post(self.url, {"simbolo":""}, format='json')

        self.assertEqual(response.status_code, 400)
    

    def test_valid_delete(self):

        client = APIClient()
        response = client.delete(self.url, {"simbolo":"ZWB"}, format='json')

        self.assertEqual(response.status_code, 200)
    
    def test_invalid_delete(self):

        client = APIClient()
        response = client.delete(self.url, {"simbolo":""}, format='json')

        self.assertEqual(response.status_code, 400)

class ConverterTestCase(TestCase):

    def setUp(self):
        
        self.moeda_test_conversao = Moedas.objects.create(simbolo='ZWB')
        self.moeda_test_base = Moedas.objects.create(simbolo='SRB')
        self.moeda_test_real = Moedas.objects.create(simbolo='BRL')
        self.moeda_test_dolar = Moedas.objects.create(simbolo='USD')
        self.moeda_test_ethereum = Moedas.objects.create(simbolo='ETH')
        self.cotacao_test = Cotacao.objects.create(moeda_de=self.moeda_test_real, moeda_para=self.moeda_test_dolar, cotacao='1.5', ultima_atualizacao='2021-03-17')
        self.url_conversao = 'http://localhost:8000/converter/?from=BRL&to=USD&amount=1000'
        self.json_rate = {'info':{'rate':1.2}, 'date':'2021-03-17'}
       

    def test_verificar_moedas(self):
        
        resultado = verificarMoeda('ZWB')
        resultado_invalido = verificarMoeda(' ')

        self.assertEqual(resultado, self.moeda_test_conversao.id)
        self.assertEqual(resultado_invalido.status_code, 400)


    def test_gravar_cotacao(self):
        
        resultado = gravarCotacao(self.moeda_test_base.id, self.moeda_test_conversao.id, self.json_rate)

        self.assertTrue(resultado)
    
    def test_buscar_cotacao_valido(self):

        resultado = buscarCotacao(self.moeda_test_real.simbolo, self.moeda_test_dolar.simbolo, '1000', self.moeda_test_real.id, self.moeda_test_dolar.id)

        self.assertTrue(resultado)

    def test_buscar_cotacao_invalido(self):

        resultado = buscarCotacao(self.moeda_test_real.simbolo, self.moeda_test_base.simbolo, '1000', self.moeda_test_real.id, self.moeda_test_base.id)

        self.assertEqual(resultado.status_code, 400)

    def test_buscar_cotacao_crypto_valido(self):

        resultado = buscarCotacao(self.moeda_test_dolar.simbolo, self.moeda_test_ethereum.simbolo, '1000', self.moeda_test_dolar.id, self.moeda_test_ethereum.id)

        self.assertTrue(resultado)

    def test_buscar_cotacao_crypto_invalido(self):

        resultado = buscarCotacao(self.moeda_test_base.simbolo, self.moeda_test_ethereum.simbolo, '1000', self.moeda_test_base.id, self.moeda_test_ethereum.id)

        self.assertEqual(resultado.status_code, 400)

    def test_converter(self):
        
        client = APIClient()
        response = client.get(self.url_conversao, format='json')

        self.assertEqual(response.status_code, 200)