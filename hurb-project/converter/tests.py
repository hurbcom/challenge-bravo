from django.test import TestCase
import requests
from converter.connector import ExternalApiConnector

# Create your tests here.


class TestService(TestCase):

    def test_1_send_two_correcly_values_and_return_200(self):
        currency_from = "BRL"
        currency_to = "USD"
        url = '{0}fsyms={1}&tsyms={2}'.format(ExternalApiConnector.BASE_URL, currency_from, currency_to)
        response = requests.get(url)
        self.assertEqual(response.status_code, 200)

    def test_2_send_two_correcly_values_and_return_200(self):
        currency_from = "BRLL"
        currency_to = "USD"
        url = '{0}fsyms={1}&tsyms={2}'.format(ExternalApiConnector.BASE_URL, currency_from, currency_to)
        response = requests.get(url)
        self.assertEqual(response.status_code, 200)
