import unittest
from unittest.mock import Mock
import requests
import json

from controllers.currency import *
from exceptions.apiexceptions import *
from models.requestmodel import *
from server.server import server

class TestCurrencyControllerGetEndpoint(unittest.TestCase):
    def setUp(self):
        self.client = server.test_client()

    def test_invalid_parameters_exception(self):
        #arrange
        expected_message = 'Parametros invalidos'
        expected_code = 400
        expected_sucess = False
        RequestValidator.validateCurrencyGetRequestArgs = Mock(side_effect=InvalidParametersException())
        #act
        result = self.client.get('/currency')
        result_data = json.loads(result.data.decode('utf-8'))
        #assert
        assert result_data['message'] == expected_message
        assert result_data['status'] == expected_code
        assert result_data['success'] == expected_sucess

    def test_invalid_currencies_exception(self):
        #arrange
        expected_message = 'Moedas nao inseridas'
        expected_code = 404
        expected_sucess = False
        RequestValidator.validateCurrencyGetRequestArgs = Mock(return_value=CurrencyGetRequestModel("HURB"))
        CurrencyService.getCurrency = Mock(side_effect=InvalidCurrenciesException())
        #act
        result = self.client.get('/currency')
        result_data = json.loads(result.data.decode('utf-8'))
        #assert
        assert result_data['message'] == expected_message
        assert result_data['status'] == expected_code
        assert result_data['success'] == expected_sucess

    def test_success_execution(self):
        #arrange
        expected_message = {}
        expected_code = 200
        expected_sucess = True
        moeda = 'HURB'
        RequestValidator.validateCurrencyGetRequestArgs = Mock(return_value=CurrencyGetRequestModel(moeda))
        CurrencyService.getCurrency = Mock(return_value={})
        #act
        result = self.client.get('/currency')
        result_data = json.loads(result.data.decode('utf-8'))
        #assert
        assert result_data[moeda] == expected_message
        assert result_data['status'] == expected_code
        assert result_data['success'] == expected_sucess
