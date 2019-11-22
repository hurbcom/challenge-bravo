from flask_restful import Resource, reqparse
from helper.exchange_validator import ExchangeValidator
from http import HTTPStatus
from repository.currency_repository import CurrencyRepository
from services.exchange import ExchangeService
from services.coin_cap import CoinCapService
# TODO: Ordenar todos os cabeçalhos


class Exchange(Resource):
    def __init__(self):
        self._crypto_service = CoinCapService()
        self._repository = CurrencyRepository()
        self._service = ExchangeService()
        self._validator = ExchangeValidator()

    def get(self):
        request = reqparse.request
        parameters = request.args.to_dict()

        sucess, errors = self._validator.validate(parameters)
        if not sucess:
            return {"errors": errors}, HTTPStatus.BAD_REQUEST

        if parameters["from"] == "BTC":
            # TODO: improve/por enquanto é só testando a api
            # TODO: Como direcionar para o service correto?
            return self._converter_btc(parameters["amount"])

        value = self._service.converter(parameters["from"],
                                        parameters["to"],
                                        parameters["amount"])

        response = {
            "value": round(value, 2)
        }
        return response, HTTPStatus.OK

    def _converter_btc(self, amount):
        return self._crypto_service.asset("BTC", float(amount))
