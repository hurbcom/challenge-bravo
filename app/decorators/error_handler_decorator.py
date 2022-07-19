from functools import wraps
from http import HTTPStatus
from typing import Callable

from flask import Response, jsonify
from marshmallow.exceptions import ValidationError

from app.errors.invalid_value_types_error import InvalidValueTypesError


def error_handler(controller: Callable) -> Callable:
    """
    Handle the errors raised from descending decorators.
    The errors MUST be inrerited from `werkzeug.exceptions.HTTPException`
    """

    @wraps(controller)
    def wrapper(*args, **kwargs) -> tuple[Response, int]:
        try:
            return controller(*args, **kwargs)
        except InvalidValueTypesError as err:
            return jsonify(err.description), err.code
        except ValidationError as err:
            msg = {"error": "Validation error.", **err.messages}
            return jsonify(msg), HTTPStatus.BAD_REQUEST

    return wrapper
