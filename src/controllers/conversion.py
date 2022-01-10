from flask import Flask, request
from flask_restx import Api, Resource

from controllers.validator.requestvalidator import RequestValidator
from server.server import *
from services.conversionservice import ConversionService

from models.responsemodel import *
from exceptions.apiexceptions import *

@sharedServer.server.route('/convert')
def get():
    try:
        request_model = RequestValidator.validateConvertRequestArgs(request.args)
        exchanged_value =  ConversionService.getCurrencyValueFromTo(request_model.to_currency,request_model.from_currency,request_model.amount)

    except (InvalidParametersException, InvalidCurrenciesException) as e:
        return ErrorResponse.create(e.message,e.statusCode)

    return SuccessResponse.create(request_model.to_currency,
                                    exchanged_value)

