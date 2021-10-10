from cerberus.validator import Validator
from flask import abort, Response
from json import dumps
from http import HTTPStatus

def validator(schema, data):
    validator = Validator(schema)
    if validator.validate(data) == False:
        abort(Response(response=dumps(validator.errors), status=HTTPStatus.BAD_REQUEST))
