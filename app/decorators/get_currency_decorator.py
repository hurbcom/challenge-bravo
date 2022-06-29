from functools import wraps
from http import HTTPStatus
from typing import Callable

from flask import Response, jsonify, request
from werkzeug.exceptions import NotFound

from app.classes.app_with_db import current_app
from app.models.cotations_model import Cotation
from app.models.currencies_model import Currency
from app.services import filter_by_or_404


def verify_currency_decorator(controller: Callable) -> Callable:
    @wraps(controller)
    def wrapper(*args, **kwargs) -> tuple[Response, int]:
        """
        Verifies if given currencies are in database and returns error response
        if don't, else, do nothing.
        Sets app.cotation, app.from_currency and app.to_currency
        """
        try:
            query_params = request.args
            _from = query_params["from"]
            to = query_params["to"]

            session = current_app.db.session
            query = session.query(Currency)
            from_curr: Currency = filter_by_or_404(
                query,
                {"code": _from},
                description={"code": _from},
            )
            to_curr: Currency = filter_by_or_404(
                query,
                {"code": to},
                description={"code": to},
            )

            current_app.from_currency = from_curr
            current_app.to_currency = to_curr

            cotation = session.query(Cotation).filter_by(code=f"{_from}{to}").first()
            current_app.cotation = cotation

            return controller(*args, **kwargs)

        except NotFound as err:
            currencies = [currency.code for currency in query.all()]
            msg = {
                "error": f"Currency {err.description['code']} not registered.",
                "curencies": currencies,
            }
            return jsonify(msg), HTTPStatus.NOT_FOUND

    return wrapper
