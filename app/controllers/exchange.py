from controllers import make_response
from flask_restful import Resource, reqparse
from helper.exchange_validator import ExchangeValidator
from http import HTTPStatus
from repository.currency_repository import CurrencyRepository
from services.coin_cap import CoinCapService
from services.exchange_rates import ExchangeRatesService


class Exchange(Resource):
    def __init__(self):
        self._crypto_service = CoinCapService()
        self._repository = CurrencyRepository()
        self._service = ExchangeRatesService()
        self._validator = ExchangeValidator()

    def get(self):
        request = reqparse.request
        parameters = request.args.to_dict()

        success, errors = self._validator.validate(parameters)
        if not success:
            return make_response(False, HTTPStatus.BAD_REQUEST, None, errors)

        base_currency, destination_currency = (
            self._repository.get_currency_by_code(parameters["from"]),
            self._repository.get_currency_by_code(parameters["to"])
        )

        if not base_currency or not destination_currency:
            return make_response(
                False,
                HTTPStatus.BAD_REQUEST,
                None,
                [f"Currency code doesn't record on currency resource."]
            )

        try:
            self._set_currency_value(base_currency)
            self._set_currency_value(destination_currency)
        except Exception as ex:
            print(ex)
            return make_response(False, HTTPStatus.INTERNAL_SERVER_ERROR,
                                 None, ["Fail in request to dependency."])

        value = parameters["amount"] * (
            base_currency.value / destination_currency.value
        )

        response = {
            "value": value
        }
        return make_response(True, HTTPStatus.OK, response)

    def _set_currency_value(self, currency):
        if self._service.is_currency_available(currency):
            currency.value = self._service.converter(currency, 1)
        elif self._crypto_service.is_currency_available(currency):
            currency.value = self._crypto_service.converter(currency, 1)
