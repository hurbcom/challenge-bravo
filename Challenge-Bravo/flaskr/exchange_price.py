# Importing the libraries
import functools
from flask import Flask, jsonify, request, Blueprint, flash, g, redirect, render_template, session, url_for
from . import currency_dao
from flaskr.db import get_db

bp = Blueprint('exchangePrice', __name__, url_prefix='/exchangePrice')

# Definindo o caminho da API
@bp.route('/getPrice', methods = ['GET'])
def getExchangePrice():
    error = None
    symbol_currency_from = request.args.get('from')
    symbol_currency_to = request.args.get('to')
    currency_amount = None
    try:
        currency_amount = float(request.args.get('amount'))
    except ValueError:
        error = "Amount value is not a float"
    # Validando a existência dos argumentos
    if not symbol_currency_from or not symbol_currency_to:
        error = "Any element of the request is missing"
    if error is None:
        final_value = None
        if symbol_currency_to.upper() == "USD":
            currency_obj = currency_dao.Currency("USD")
            usd_value = currency_dao.retrieveValue(currency_obj)
            final_value = usd_value * amount
        else:
            currency_obj = currency_dao.Currency(symbol_currency_from)
            usd_value_currency_from = currency_dao.retrieveValue(currency_obj)
            currency_obj = currency_dao.Currency(symbol_currency_to)
            usd_value_currency_to = currency_dao.retrieveValue(currency_obj)
            final_value = currency_amount * usd_value_currency_from / usd_value_currency_to
        return jsonify(final_value), 200
    return jsonify(error), 400

