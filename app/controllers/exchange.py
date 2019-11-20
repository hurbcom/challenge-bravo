from flask_restful import Resource, reqparse
from http import HTTPStatus
from repository.currency_repository import CurrencyRepository
from helper.exchange_validator import ExchangeValidator
from services.exchange import ExchangeService
# TODO: Ordenar todos os cabeçalhos


class Exchange(Resource):
    def __init__(self):
        self._repository = CurrencyRepository()
        self._service = ExchangeService()
        self._validator = ExchangeValidator()

    def get(self):
        request = reqparse.request
        parameters = request.args.to_dict()

        sucess, errors = self._validator.validate(parameters)
        if not sucess:
            return {"errors": errors}, HTTPStatus.BAD_REQUEST

        value = self._service.converter(parameters['from'],
                                        parameters['to'],
                                        parameters['amount'])

        return value
