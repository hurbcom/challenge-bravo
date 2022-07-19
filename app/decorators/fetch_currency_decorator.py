from datetime import datetime
from functools import wraps
from http import HTTPStatus
from typing import Callable

from flask import Response, jsonify, request
from werkzeug.exceptions import NotFound

from app.classes.app_with_db import current_app
from app.models.cotations_model import Cotation
from app.models.currencies_model import Currency
from app.services import filter_by_or_404


def fetch_currency(controller: Callable) -> Callable:
    @wraps(controller)
    def wrapper(*args, **kwargs) -> tuple[Response, int]:
        now = datetime.now()
        cotation = current_app.cotation
        updated = True

        if cotation:
            diff = now - current_app.cotation.updated_at
            updated = diff.total_seconds() < 60

        current_app.cotation_is_updated = updated

        return controller(*args, **kwargs)

    return wrapper
