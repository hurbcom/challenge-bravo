from typing import List
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from coin.models import Coin


class CoinTestCase(APITestCase):
    def setUp(self):
        pass

    def test_create_coin(self):
        url = reverse('coin-list')
        data = {'code': 'NEW', 'name': 'New Coin', 'value': 0.5}
        resp = self.client.post(url, data=data, format='json')
        self.assertIsNotNone(resp)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        expected = {'code': 'NEW', 'name': 'New Coin', 'value': '0.50000000'}
        self.assertDictEqual(resp.json(), expected)

    def test_list_coin(self):
        url = reverse('coin-list')
        resp = self.client.get(url, format='json')
        self.assertIsNotNone(resp)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIsInstance(resp.json(), List)

    def test_get_coin(self):
        data = 'BRL'
        url = reverse('coin-detail', kwargs={'pk': data})
        resp = self.client.get(url, format='json')
        self.assertIsNotNone(resp)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        expected = Coin.objects.get(code=data)
        self.assertDictEqual(resp.json(), {
            'code': expected.code,
            'name': expected.name,
            'value': str(expected.value)})

    def test_delete_coin(self):
        data = 'BRL'
        url = reverse('coin-detail', kwargs={'pk': data})
        resp = self.client.delete(url, format='json')
        self.assertIsNotNone(resp)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)

    def test_cant_delete_USD_coin(self):
        data = 'USD'
        url = reverse('coin-detail', kwargs={'pk': data})
        resp = self.client.delete(url, format='json')
        self.assertIsNotNone(resp)
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        data = {'error': "You can't delete USD coin"}
        self.assertDictEqual(resp.json(), data)

    def test_convert_coin(self):
        url = reverse('coin-convert')
        data = {'to': 'BRL', 'from': 'BTC', 'amount': 100}
        url = f'{url}?from={data["from"]}&to={data["to"]}&amount={data["amount"]}'
        resp = self.client.get(url, format='json')
        TO = Coin.objects.get(code=data["to"])
        FROM = Coin.objects.get(code=data["from"])
        expected = {TO.code: float((data['amount'] * TO.value) / FROM.value)}
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.json(), expected)
