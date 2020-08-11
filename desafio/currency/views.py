from desafio.currency.model import Currency
from flask import request, jsonify, Blueprint
from http import HTTPStatus
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
        return json.dumps({'message': "A moeda ja existe"}),\
            HTTPStatus.CONFLICT, JSON_CONTENT

    result = service_currency_price.find_symbol_currency(
        currency.simbol_currency)

    if result['Response'] == "Error":
        return json.dumps({'message': 'Essa moeda não existe'}),\
            HTTPStatus.NO_CONTENT, JSON_CONTENT

    currencys.insert(currency)
    return json.dumps({'message': 'Sua moeda foi criada com sucesso'}),\
        HTTPStatus.CREATED, JSON_CONTENT


@bp.route('/', methods=["GET"])
def get_quotes():
    cg = cache.get('quote')
    from_currency = request.args.get('from')
    to_currency = request.args.get('to')
    amount = request.args.get('amount')

    currencies = CurrencyRepository()

    if from_currency:
        currency = Currency(simbol_currency=from_currency)
        find_currency = currencies.get_currency_by_simbol_currency(currency)

    if not find_currency:
        return '', HTTPStatus.NO_CONTENT, JSON_CONTENT

    service_currency_price = ServiceQuoteCurrencyPrice(
        symbol_currency=find_currency.simbol_currency,
        currencies_quote=[to_currency])

    if cg is None:
        cg = service_currency_price. \
            calc_currency_price_by_currencies_quote(
                float(amount))
        cache.set('quote', cg, timeout=50)

    return json.dumps(cg, cls=EnhancedJSONEncoder),\
        HTTPStatus.OK, JSON_CONTENT


@bp.route('/<int:currency_id>', methods=['DELETE'])
@bp.route('/<symbol_currency>', methods=['DELETE'])
def delete_currencys(currency_id=None, symbol_currency=None):
    currencies = CurrencyRepository()
    if currency_id:
        currency = Currency(id=currency_id)
    else:
        currency = Currency(simbol_currency=symbol_currency)

    if currencies.get_currency_by_simbol_currency(currency):
        currencies.delete(currency)
        return json.dumps({'message': f'A moeda {currency.name_description} '
                           + 'foi removida com sucesso'}), \
            HTTPStatus.OK, JSON_CONTENT

    return '', HTTPStatus.NO_CONTENT


@bp.route("/all", methods=['GET'])
def get_currencies():
    currencies = CurrencyRepository().get_all_currency()

    dict_currencies = {
        currency.simbol_currency: currency.name_description
        for currency in currencies}

    return json.dumps(dict_currencies, cls=EnhancedJSONEncoder), \
        HTTPStatus.OK, JSON_CONTENT
