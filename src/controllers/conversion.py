from flask import Flask, request
from flask_restx import Api, Resource

from controllers.validator.requestvalidator import RequestValidator
from server.server import *
from services.conversionservice import ConversionService

from models.responsemodel import *
from exceptions.apiexceptions import *

@server.api.route('/convert')
class ConversionController(Resource):
    def get(self, ):
        try:
            request_model = RequestValidator.validateConvertRequestArgs(request.args)
            exchanged_value = ConversionService.getCurrecyValueFromTo(request_model.to_currency,request_model.from_currency,request_model.amount)

        except InvalidParametersException as e:
            return ErrorResponse.create(str(e),e.statusCode)

        return SuccessResponse.create(request_model.to_currency,
                                      exchanged_value)