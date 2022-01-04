from flask import Flask, request
from flask_restx import Api, Resource

from server.server import ServerInitializer
from controllers.validator.requestvalidator import RequestValidator
from models.responsemodel import *
from exceptions.apiexceptions import *



mocked_coins = { 'USD' : { 'BTC' : 5, 'BRL' : 6, 'EUR' : 4, 'ETH' : 0.4, 'USD' : 1},
                 'BRL' : { 'USD' : 5, 'BTC' : 6, 'EUR' : 4, 'ETH' : 0.4, 'BRL' : 1},
                 'EUR' : { 'USD' : 5, 'BRL' : 6, 'BTC' : 4, 'ETH' : 0.4, 'EUR' : 1},
                 'ETH' : { 'USD' : 5, 'BRL' : 6, 'EUR' : 4, 'BTC' : 0.4, 'ETH' : 1},
                 'BTC' : { 'USD' : 5, 'BRL' : 6, 'EUR' : 4, 'ETH' : 0.4, 'BTC' : 1}}

@ServerInitializer.api.route('/convert')
class ConversionController(Resource):
    def get(self, ):
        try:
            requestModel = RequestValidator.validateConvertRequestArgs(request.args)
        except InvalidParametersException as e:
            return ErrorResponse.create(str(e),e.statusCode)

        return SuccessResponse.create(requestModel.to_currency, { 'value' : 1 })