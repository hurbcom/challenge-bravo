from flask import Blueprint

from app.controllers.conversion_controllers.get_conversion import get_conversion
from app.decorators import verify_currency_decorator

bp_currency = Blueprint("currency", __name__, url_prefix="/")


bp_currency.get("")(verify_currency_decorator(get_conversion))
