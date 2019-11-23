from controllers import make_response as response
from flask_restful import Resource, reqparse
from helper.currency_validator import CurrencyValidator
from http import HTTPStatus
from models.currency import CurrencyModel
from repository.currency_repository import CurrencyRepository
from services.coin_cap import CoinCapService
from services.exchange_rates import ExchangeRatesService


class Currency(Resource):
    def __init__(self):
        # TODO: Se o staticmethod ficar totalmente independente dos serviços, não precisarei instanciá los aqui.
        self._crypto_service = CoinCapService()
        self._exchange_service = ExchangeRatesService()
        self._repository = CurrencyRepository()
        self._validator = CurrencyValidator()

    def get(self):
        currencies = self._repository.get_currencies()
        currency_dict = [c.to_dict() for c in currencies]
        return response(True, HTTPStatus.OK, data=currency_dict)

    def post(self):
        request = reqparse.request
        body = request.get_json()

        sucess, errors = self._validator.validate(body)
        if not sucess:
            return {"errors": errors}, HTTPStatus.BAD_REQUEST

        new_currenty = CurrencyModel(**body)

        if self._repository.get_currency_by_code(new_currenty.code):
            return response(
                False,
                HTTPStatus.CONFLICT,
                self._repository.get_currency_by_code(new_currenty.code).to_dict(),
                [f"Resource '{new_currenty.code}' already exists."]
            )

        if not (ExchangeRatesService.is_currency_available(new_currenty) or
                CoinCapService.is_currency_available(new_currenty)):
            return response(
                False,
                HTTPStatus.NOT_IMPLEMENTED,
                None,
                [f"'{new_currenty.code}' not avaiable in our exchange services."]
            )

        self._repository.insert(new_currenty)
        return response(True, HTTPStatus.CREATED)

    def delete(self):
        request = reqparse.request
        code = request.args.get('code')

        if not code:
            return response(
                False,
                HTTPStatus.BAD_REQUEST,
                None,
                ["'code' is a required argument"]
            )
        # TODO: devo tratar caso não exista o code desejado no meu db?
        self._repository.delete(code)
        # TODO: Por que a resposta não está sendo printada no postman?
        # responsta: se sar o httpstatus no content, não retorna o conteúdo no body.
        return response(True, HTTPStatus.OK)
