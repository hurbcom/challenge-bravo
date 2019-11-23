from controllers import make_response
from flask_restful import Resource, reqparse
from helper.exchange_validator import ExchangeValidator
from http import HTTPStatus
from repository.currency_repository import CurrencyRepository
from services.coin_cap import CoinCapService
from services.exchange import ExchangeService
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
            return make_response(False, HTTPStatus.BAD_REQUEST, None, errors)

        base_currency = self._repository.get_currency_by_code(parameters["from"])
        destination_currency = self._repository.get_currency_by_code(
            parameters["to"]
        )

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

        exchange_rates_currencies = self._service.get_available_currencies()
        crypto_cap_currencies = self._crypto_service.get_available_currencies()

        if base_currency.code in exchange_rates_currencies and destination_currency.code in exchange_rates_currencies:
            value = self._service.converter(base_currency,
                                            destination_currency,
                                            parameters["amount"])
            return make_response(True, HTTPStatus.OK, {"value": value})
        elif base_currency.code in exchange_rates_currencies and destination_currency.code in crypto_cap_currencies:
            base_value = self._service.converter(base_currency.code,
                                                 amount=parameters["amount"])
            # TODO método p calcular destination no crypto
        elif base_currency.code in crypto_cap_currencies and destination_currency.code in exchange_rates_currencies:
            destination_value = self._service.converter(destination_currency.code,
                                                        amount=parameters["amount"])
            # TODO método p calcular base no crypto
        elif base_currency.code in crypto_cap_currencies and destination_currency.code in crypto_cap_currencies:
            # AS DUAS MOEDAS SOLICITADAS SÃO CRYPTO. FAZER CONVERSÃO.
            pass
        else:
            #moeda desconhecida. se for feito corretamente a validação inserção de novas moedas, este problema não deve acontecer.
            pass

        # TODO: melhorar contrato de response
        response = {
            "value": round(value, 2)
        }
        return make_response(True, HTTPStatus.OK, response)

    def _converter_btc(self, amount):
        return self._crypto_service.asset("BTC", float(amount))
