from functools import wraps
from typing import Callable

from flask import Response, jsonify

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

    return wrapper
