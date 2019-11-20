from flask_restful import Resource, reqparse
from models.currency import CurrencyModel
from helper.currency_validator import CurrencyValidator
from http import HTTPStatus
from repository.currency_repository import CurrencyRepository


class Currency(Resource):
    def __init__(self):
        self._repository = CurrencyRepository()
        self._validator = CurrencyValidator()

    def get(self):
        currencies = self._repository.get_currencies()
        response = [c.to_dict() for c in currencies]
        return response, HTTPStatus.OK

    def post(self):
        request = reqparse.request
        body = request.get_json()

        sucess, errors = self._validator.validate(body)
        if not sucess:
            return {"errors": errors}, HTTPStatus.BAD_REQUEST

        # TODO: Incluir ID autogerado para os objetos
        new_currenty = CurrencyModel(**body)
        self._repository.insert(new_currenty)

        return {"success": True}, HTTPStatus.ACCEPTED

    def delete(self):
        return 'Not implemented yet', HTTPStatus.INTERNAL_SERVER_ERROR
