from controllers import make_response
from flask_restful import Resource, reqparse
from helper.exchange_validator import ExchangeValidator
from http import HTTPStatus
from repository.currency_repository import CurrencyRepository
from services.coin_cap import CoinCapService
from services.exchange_rates import ExchangeRatesService
# TODO: Ordenar todos os cabeçalhos


class Exchange(Resource):
    def __init__(self):
        # TODO: resolver o staticmethod dos serviçoes para não precisa instancia los aqui
        self._crypto_service = CoinCapService()
        self._repository = CurrencyRepository()
        self._service = ExchangeRatesService()
        self._validator = ExchangeValidator()

    def get(self):
        request = reqparse.request
        parameters = request.args.to_dict()

        sucess, errors = self._validator.validate(parameters)
        if not sucess:
            return make_response(False, HTTPStatus.BAD_REQUEST, None, errors)

        base_currency, destination_currency = (
            self._repository.get_currency_by_code(parameters["from"]),
            self._repository.get_currency_by_code(parameters["to"])
        )

        # TODO: Melhorar resposta para retornar todos os erros possíveis.
        # vale a pena o esforço?
        if not base_currency:
            return make_response(
                False,
                HTTPStatus.BAD_REQUEST,
                None,
                [f"'{parameters['from']}' doesn't record on currency resource."]
            )
        elif not destination_currency:
            return make_response(
                False,
                HTTPStatus.BAD_REQUEST,
                None,
                [f"'{parameters['to']}' doesn't record on currency resource."]
            )

        if ExchangeRatesService.is_currency_available(base_currency) and ExchangeRatesService.is_currency_available(destination_currency):
            value = self._service.converter(base_currency,
                                            parameters["amount"],
                                            destination_currency)

        self.set_currency_value(base_currency)
        self.set_currency_value(destination_currency)

        value = parameters["amount"] * destination_currency.value / base_currency.value
        # TODO: melhorar contrato de response

        response = {
            "value": value
        }
        return make_response(True, HTTPStatus.OK, response)

    def set_currency_value(self, currency):
        if ExchangeRatesService.is_currency_available(currency):
            currency.value = self._service.converter(currency, 1)
        elif CoinCapService.is_currency_available(currency):
            currency.value = self._crypto_service.asset(currency, 1)
