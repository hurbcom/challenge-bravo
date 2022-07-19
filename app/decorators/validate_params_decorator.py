from functools import wraps
from http import HTTPStatus
from typing import Callable

from flask import jsonify, request
from flask.wrappers import Response

from app.classes.app_with_db import current_app
from app.schemas import ConversionSchema
from app.services.verify_types_service import verify_types


def valdiate_params(controller: Callable) -> Callable:
    """
    Validates if all params necessessary to conversion was passed.
    Sets `app.from_param`, `app.to_param` and `app.amount_param`.
    """

    @wraps(controller)
    def wrapper(*args, **kwargs) -> tuple[Response, int]:
        REQUIRED_PARAMS = {"from", "to", "amount"}

        received_params = {
            key: value for key, value in request.args.items() if key in REQUIRED_PARAMS
        }

        serialized = ConversionSchema(unknown="exclude").load(received_params)

        current_app.from_param = serialized["from"]
        current_app.to_param = serialized["to"]
        current_app.amount_param = float(serialized["amount"])

        return controller(*args, **kwargs)

    return wrapper
