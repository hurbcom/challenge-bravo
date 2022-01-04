from flask import Flask, request
from flask_restx import Api, Resource

from controllers.validator.requestvalidator import RequestValidator
from dao.conversiondao import ConversionDao
from server.server import ServerInitializer

from models.responsemodel import *
from exceptions.apiexceptions import *

@ServerInitializer.api.route('/convert')
class ConversionController(Resource):
    def get(self, ):
        try:
            request_model = RequestValidator.validateConvertRequestArgs(request.args)
            exchanged_value = ConversionDao.getCurrecyValueFrom(request_model.to_currency,request_model.from_currency)

        except InvalidParametersException as e:
            return ErrorResponse.create(str(e),e.statusCode)

        return SuccessResponse.create(request_model.to_currency,
                                      exchanged_value)