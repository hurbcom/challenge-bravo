from flask import Blueprint

from app.controllers.conversion_controllers.get_conversion import get_conversion
from app.decorators import (
    check_cotation,
    error_handler,
    valdiate_params,
    verify_currency,
)

bp_currency = Blueprint("currency", __name__, url_prefix="/")


@bp_currency.get("")
@error_handler
@valdiate_params
@verify_currency
@check_cotation
def get_conversion_caller():
    return get_conversion()
