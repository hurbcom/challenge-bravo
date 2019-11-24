from controllers import make_response as response
from flask_restful import Resource, reqparse
from helper.currency_validator import CurrencyValidator
from http import HTTPStatus
from models.currency import CurrencyModel
from repository.currency_repository import CurrencyRepository
from services.coin_cap import CoinCapService
from services.exchange_rates import ExchangeRatesService, BALLAST


class Currency(Resource):
    def __init__(self):
        self._crypto_service = CoinCapService()
        self._repository = CurrencyRepository()
        self._service = ExchangeRatesService()
        self._validator = CurrencyValidator()

    def get(self):
        currencies = self._repository.get_currencies()
        currency_dict = [c.to_dict() for c in currencies]
        return response(True, HTTPStatus.OK, data=currency_dict)

    def post(self):
        request = reqparse.request
        body = request.get_json()

        success, errors = self._validator.validate(body)
        if not success:
            return {"errors": errors}, HTTPStatus.BAD_REQUEST

        new_currenty = CurrencyModel(**body)

        if self._repository.get_currency_by_code(new_currenty.code):
            return response(
                False,
                HTTPStatus.CONFLICT,
                self._repository.get_currency_by_code(
                    new_currenty.code).to_dict(),
                [f"Resource '{new_currenty.code}' already exists."]
            )

        if not (self._service.is_currency_available(new_currenty) or
                self._crypto_service.is_currency_available(new_currenty)):
            return response(
                False,
                HTTPStatus.NOT_IMPLEMENTED,
                None,
                [f"'{new_currenty.code}' not avaiable "
                 "in our exchange services."]
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
        elif code == BALLAST.code:
            return response(
                False,
                HTTPStatus.BAD_REQUEST,
                None,
                [f"'{code}' is the service ballast and "
                 "can't be deleted."]
            )

        self._repository.delete(code)
        return response(True, HTTPStatus.OK)
