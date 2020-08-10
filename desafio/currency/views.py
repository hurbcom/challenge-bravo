from desafio.currency.model import Currency
from flask import request, jsonify, Blueprint
from desafio.utils import EnhancedJSONEncoder
import json
from desafio.currency.repository import CurrencyRepository
from desafio.currency.schems import scheme_currency
from flask_expects_json import expects_json
from desafio.services import ServiceQuoteCurrencyPrice


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
        currency_base=currency.simbol_currency)

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
