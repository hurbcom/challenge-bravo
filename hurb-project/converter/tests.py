from django.test import TestCase
import requests
from converter.connector import ExternalApiConnector
from converter.models import *
from converter.utils import *
import json
from django.core.exceptions import ValidationError



# Create your tests here.


class TestCurrency(TestCase):

    def setUp(self):
        self.currencies = Currency.objects.all()
        self.value = 1
        self.quotation = 4.2
        self.convert_from = 'BRL'
        self.convert_to = 'USD'
        self.url_base = 'http://127.0.0.1:8000/api/v1/currency/'
        self.headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
        }

    def test_1_return_float_when_calculate_amount(self):
        self.assertEqual(type(conversion_calculate(self.value,self.quotation)), float)

    def test_2_return_false_when_send_only_one_corretly_symbol(self):
        convert_from = "Valor qualquer"
        self.assertEqual(verify_if_exists_symbols(convert_from, self.convert_to), False)

    def test_3_return_400_when_register_duplicated_symbol(self):
       
        json_test = {"symbol": self.convert_from, "description":"Descrição qualquer"}
        response = requests.post(self.url_base, data=json.dumps(json_test), headers=self.headers)
        self.assertEqual(response.status_code, 400)

    def test_4_return_400_when_send_two_equals_symbols_to_convert(self):
        url_test = '{0}convert_value/?from={1}&to={2}&amount={3}'.format(self.url_base, self.convert_from, self.convert_from, self.value)
        response = requests.post(url_test, headers=self.headers)
        self.assertEqual(response.status_code, 400)

    def test_5_return_400_when_send_negative_amount_to_convert(self):
        url_test = '{0}convert_value/?from={1}&to={2}&amount={3}'.format(self.url_base, self.convert_to, self.convert_from, -self.value)
        response = requests.post(url_test, headers=self.headers)
        self.assertEqual(response.status_code, 400)



class TestServices(TestCase):

    def setUp(self):
        self.currencies = Currency.objects.all()
        self.convert_from = 'BRL'
        self.convert_to = 'USD'
        self.url_base = ExternalApiConnector.BASE_URL

    def test_1_send_two_correcly_values_and_return_200(self):
        url = '{0}fsyms={1}&tsyms={2}'.format(self.url_base, self.convert_from, self.convert_to)
        response = requests.get(url)
        self.assertEqual(response.status_code, 200)

    def test_2_return_validation_error_if_not_find_symbol(self):
        self.assertRaises(ValidationError, ExternalApiConnector.get_quotation, self, "Simbolo Qualquer Nao existente", self.convert_to)