import json
from decimal import Decimal

from django.test import TestCase
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase, APIClient

from core.models import Currency


class CurrencyTestCase(TestCase):

    def setUp(self):
        self.currencies = {}
        test_values = {
            'USD': 1,
            'BRL': 0.2,
            'BTC': 8000,
            'ETH': 200,
        }
        for symbol, value in test_values.items():
            currency = Currency.objects.get(symbol=symbol)
            currency.value = value
            currency.save()
            self.currencies[symbol] = currency

    def test_brl_to_usd(self):
        brl = self.currencies['BRL']
        self.assertEqual(Decimal('2'), brl.to(10, 'USD'))

    def test_usd_to_brl(self):
        usd = self.currencies['USD']
        self.assertEqual(Decimal('50'), usd.to(10, 'BRL'))

    def test_btc_to_usd(self):
        btc = self.currencies['BTC']
        self.assertEqual(Decimal('80000'), btc.to(10, 'USD'))

    def test_brl_to_eth(self):
        brl = self.currencies['BRL']
        self.assertEqual(Decimal('0.01'), brl.to(10, 'ETH'))

    def test_change_base(self):
        brl = self.currencies['BRL']
        brl.is_base = True
        brl.save()
        self.assertEqual(1, Currency.objects.filter(is_base=True).count())
        self.assertEqual('BRL', Currency.objects.get(is_base=True).symbol)
        self.assertFalse(Currency.objects.get(symbol='USD').is_base)


class CurrencyAPITestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.currencies = {}
        test_values = {
            'USD': 1,
            'BRL': 0.2,
            'BTC': 8000,
            'ETH': 200,
        }
        for symbol, value in test_values.items():
            currency = Currency.objects.get(symbol=symbol)
            currency.value = value
            currency.save()
            self.currencies[symbol] = currency

    def test_get_usd(self):
        response = self.client.get(reverse(
            'api:currency-detail',
            kwargs={'symbol': 'USD'},
        ))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        data = json.loads(response.content)
        self.assertEqual('USD', data['symbol'])
        self.assertTrue(data['is_base'])
        self.assertEqual(Decimal(1), Decimal(data['value']))

    def test_usd_to_brl(self):
        response = self.client.get(reverse('api:currency-to', kwargs={
            'symbol': 'USD',
            'amount': 10,
            'destiny_symbol': 'BRL',
        },))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        data = json.loads(response.content)
        self.assertEqual(Decimal(50), Decimal(data['value']))

    def test_brl_to_eth(self):
        response = self.client.get(reverse('api:currency-to', kwargs={
            'symbol': 'BRL',
            'amount': 10,
            'destiny_symbol': 'ETH',
        },))
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        data = json.loads(response.content)
        self.assertEqual(Decimal('0.01'), Decimal(data['value']))
