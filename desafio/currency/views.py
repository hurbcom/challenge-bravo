from desafio.currency.model import Currency
from flask import request, jsonify, Blueprint
from desafio.utils import EnhancedJSONEncoder
import json
from desafio.currency.repository import CurrencyRepository
from desafio.currency.schems import scheme_currency
from flask_expects_json import expects_json
from desafio.services import ServiceQuoteCurrencyPrice
from desafio.extensions import cache


bp = Blueprint('currencies', __name__,
               url_prefix="/currency")

JSON_CONTENT = {'Content-Type': 'application/json'}


@bp.route("/healthcheck", methods=['GET'], strict_slashes=False)
def healthcheck():
    return jsonify({'status': 'online'})


@bp.route('/', methods=['POST'])
@expects_json(scheme_currency)
def insert_currency():
    currencys = CurrencyRepository()
    content = request.get_json()

    currency = Currency()
    currency.simbol_currency = content['simbol_currency']
    currency.name_description = content['name_description']

    service_currency_price = ServiceQuoteCurrencyPrice(
        symbol_currency=currency.simbol_currency)

    if currencys.get_currency_by_simbol_currency(currency):
        return json.dumps({'message': "A moeda ja existe"}), 409,
        JSON_CONTENT

    result = service_currency_price.find_symbol_currency(
        currency.simbol_currency)

    if result['Response'] == "Error":
        return json.dumps({'message': 'Essa moeda não existe'}), 204,
        JSON_CONTENT

    currencys.insert(currency)
    return json.dumps({'message': 'Sua moeda foi criada com sucesso'}), 201,
    JSON_CONTENT


@bp.route('/', methods=["GET"])
@cache.cached(timeout=50, key_prefix='quote')
def get_quotes():
    from_currency = request.args.get('from')
    to_currency = request.args.get('to')
    amount = request.args.get('amount')

    currencies = CurrencyRepository()

    if from_currency:
        currency = Currency(simbol_currency=from_currency)
        find_currency = currencies.get_currency_by_simbol_currency(currency)

    if not find_currency:
        return json.dumps({'message': 'Não possuimos essa Moeda cadastrada'}), 204, JSON_CONTENT

    service_currency_price = ServiceQuoteCurrencyPrice(
        symbol_currency=find_currency.simbol_currency,
        currencies_quote=[to_currency])

    result_calc = service_currency_price. \
        calc_currency_price_by_currencies_quote(
            float(amount))

    return json.dumps(result_calc, cls=EnhancedJSONEncoder), 200, JSON_CONTENT
