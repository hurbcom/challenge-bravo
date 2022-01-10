import unittest
from unittest.mock import Mock
import unittest.mock as mock
import requests
import json

from controllers.conversion import *
from services.conversionservice import *
from controllers.validator.requestvalidator import RequestValidator
from exceptions.apiexceptions import InvalidCurrenciesException,InvalidParametersException
from models.requestmodel import *
from server.server import server

class TestConversionControllerGetEndpoint(unittest.TestCase):
    def setUp(self):
        self.client = server.test_client()

    def test_invalid_parameters_exception(self):
        #arrange
        expected_message = 'Parametros invalidos'
        expected_code = 400
        expected_sucess = False
        RequestValidator.validateConvertRequestArgs = Mock(side_effect=InvalidParametersException())
        #act
        result = self.client.get('/convert')
        result_data = json.loads(result.data.decode('utf-8'))
        #assert
        assert result_data['message'] == expected_message
        assert result_data['status'] == expected_code
        assert result_data['success'] == expected_sucess

    @mock.patch('services.conversionservice.ConversionService.getCurrencyValueFromTo')
    def test_invalid_currencies_exception(self,patcher_getCurrencyValueFromTo):
        #arrange
        expected_message = 'Moedas nao inseridas'
        expected_code = 404
        expected_sucess = False
        RequestValidator.validateConvertRequestArgs = Mock(return_value=ConvertRequestModel("HURB","error",3))
        patcher_getCurrencyValueFromTo.side_effect=InvalidCurrenciesException()
        #act
        result = self.client.get('/convert')
        result_data = json.loads(result.data.decode('utf-8'))
        #assert
        assert result_data['message'] == expected_message
        assert result_data['status'] == expected_code
        assert result_data['success'] == expected_sucess

    @mock.patch('services.conversionservice.ConversionService.getCurrencyValueFromTo')
    def test_success_execution(self,patcher_getCurrencyValueFromTo):
        #arrange
        expected_value = 10
        expected_code = 200
        expected_sucess = True
        moeda = 'HURB'
        RequestValidator.validateConvertRequestArgs = Mock(return_value=ConvertRequestModel(moeda,"USD",1))
        patcher_getCurrencyValueFromTo.return_value = expected_value
        #act
        result = self.client.get('/convert')
        result_data = json.loads(result.data.decode('utf-8'))
        #assert
        assert result_data[moeda] == expected_value
        assert result_data['status'] == expected_code
        assert result_data['success'] == expected_sucess
