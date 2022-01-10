import unittest
from unittest.mock import Mock
import requests
import json

from controllers.currency import *
from exceptions.apiexceptions import *
from models.requestmodel import *
from server.server import server

class TestCurrencyControllerPutEndpoint(unittest.TestCase):
    def setUp(self):
        self.client = server.test_client()

    def test_invalid_parameters_exception(self):
        #arrange
        expected_message = 'Parametros invalidos'
        expected_code = 400
        expected_sucess = False
        RequestValidator.validateCurrencyPutRequestArgs = Mock(side_effect=InvalidParametersException())
        #act
        result = self.client.put('/currency')
        result_data = json.loads(result.data.decode('utf-8'))
        #assert
        assert result_data['message'] == expected_message
        assert result_data['status'] == expected_code
        assert result_data['success'] == expected_sucess

    def test_database_exception(self):
        #arrange
        expected_message = 'Nao foi possível inserir moeda'
        expected_code = 500
        expected_sucess = False
        RequestValidator.validateCurrencyPutRequestArgs = Mock(return_value=CurrencyPutRequestModel("HURB",300))
        CurrencyService.saveCurrency = Mock(side_effect=DatabaseException())
        #act
        result = self.client.put('/currency')
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
        RequestValidator.validateCurrencyPutRequestArgs = Mock(return_value=CurrencyPutRequestModel(moeda,300))
        CurrencyService.saveCurrency = Mock(return_value={})
        #act
        result = self.client.put('/currency')
        result_data = json.loads(result.data.decode('utf-8'))
        #assert
        assert result_data[moeda] == expected_message
        assert result_data['status'] == expected_code
        assert result_data['success'] == expected_sucess

if __name__ == '__main__':
    unittest.main()
