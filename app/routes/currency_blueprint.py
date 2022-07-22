from flask import Blueprint

from app.controllers.conversion_controllers.get_conversion import get_conversion
from app.controllers.currency_controllers import register_currency
from app.decorators import (
    check_cotation,
    error_handler,
    valdiate_params,
    validate_schema,
    verify_currency,
)
from app.schemas import CurrencySchema

bp_currency = Blueprint("currency", __name__, url_prefix="")


@bp_currency.get("")
@error_handler
@valdiate_params
@verify_currency
@check_cotation
def get_conversion_caller():
    return get_conversion()


@bp_currency.post("")
@error_handler
@validate_schema(CurrencySchema)
def register_currency_caller():
    return register_currency()
