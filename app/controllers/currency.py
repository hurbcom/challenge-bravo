from flask_restful import Resource, reqparse
from models.currency import CurrencyModel
from helper.currency_validator import CurrencyValidator
from http import HTTPStatus
from repository.currency_repository import CurrencyRepository
from controllers import make_response as response


class Currency(Resource):
    def __init__(self):
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
                None,
                [f"Resource '{new_currenty.code}' already exists."]
            )

        # TODO: Validar se o currency code existe na api exchange
        # TODO: Validar se o currency code existe na api crypto

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

        self._repository.delete(code)
        # TODO: Por que a resposta não está sendo printada no postman?
        return response(True, HTTPStatus.NO_CONTENT)
