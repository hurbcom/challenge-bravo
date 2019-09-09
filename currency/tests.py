from rest_framework import status
from rest_framework.test import APITestCase
from datetime import datetime
from .models import Currency

class CurrencyTests(APITestCase):

    def get_data_test(self):
        return {'name':'Real', 'shortname':'R$', 'symbol':'BRL', 'created_at':datetime.now()}
    
    def add_object_test(self):
        return self.client.post('/currency/', self.get_data_test(), format='json')

    def test_create_currency(self):
        """
        Ensure we can create a new currency object.
        """
        response = self.add_object_test()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Currency.objects.count(), 1)
        self.assertEqual(Currency.objects.get().symbol, self.get_data_test()['symbol'])

    def test_get_currency(self):
        """
        Ensure we can get a currency object.
        """
        self.add_object_test()
        response = self.client.get('/currency/%s/' % self.get_data_test()['symbol'], format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Currency.objects.count(), 1)
        self.assertEqual(Currency.objects.get().symbol, self.get_data_test()['symbol'])

    def test_delete_currency(self):
        """
        Ensure we can delete a currency object.
        """
        
        self.add_object_test()
        response = self.client.delete('/currency/%s/' % self.get_data_test()['symbol'], format='json')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Currency.objects.count(), 0)