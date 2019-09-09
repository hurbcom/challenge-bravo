from rest_framework import status
from rest_framework.test import APITestCase
from datetime import datetime


class ConverterTests(APITestCase):

    def get_data_test(self):
        return [
                {'name':'Real', 'shortname':'R$', 'symbol':'BRL', 'created_at':datetime.now()},
                {'name':'Dolar', 'shortname':'US$', 'symbol':'USD', 'created_at':datetime.now()}
        ]
    
    def add_object_test(self):
        self.client.post('/currency/', self.get_data_test()[0], format='json')
        self.client.post('/currency/', self.get_data_test()[1], format='json')
        return True

    def test_get_converter(self):
        """
        Ensure we can get a conversion result.
        """
        self.add_object_test()
        
        response = self.client.get('/converter/?from=%s&to=%s&amount=123.52' % 
                (self.get_data_test()[0]['symbol'],self.get_data_test()[1]['symbol']), format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
