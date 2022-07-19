from functools import wraps
from http import HTTPStatus
from typing import Callable

from flask import jsonify, request
from flask.wrappers import Response

from app.classes.app_with_db import current_app
from app.services.verify_types_service import verify_types


def valdiate_params(controller: Callable) -> Callable:
    """
    Validates if all params necessessary to conversion was passed.
    Sets `app.from_param`, `app.to_param` and `app.amount_param`.
    """

    @wraps(controller)
    def wrapper(*args, **kwargs) -> tuple[Response, int]:
        REQUIRED_PARAMS = {"from", "to", "amount"}

        received_params = request.args.keys()

        if not REQUIRED_PARAMS.issubset(received_params):

            missing = REQUIRED_PARAMS.difference(received_params)

            msg = {"error": "Missing params.", "missing": list(missing)}

            return jsonify(msg), HTTPStatus.BAD_REQUEST

        params = {param: request.args[param] for param in REQUIRED_PARAMS}

        verify_types(**params)

        current_app.from_param = request.args["from"]
        current_app.to_param = request.args["to"]
        current_app.amount_param = float(request.args["amount"])

        return controller(*args, **kwargs)

    return wrapper
