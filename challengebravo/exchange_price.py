# Importing the libraries
from flask import jsonify, request, Blueprint
from . import currency_dao

bp = Blueprint('exchangePrice', __name__, url_prefix='/exchangePrice')

# API de conversão de moeda
@bp.route('/convertCurrency', methods = ['GET'])
def getConvertedValue():
    error = None
    symbol_currency_from = request.args.get('from')
    symbol_currency_to = request.args.get('to')
    currency_amount = None
    try:
        currency_amount = float(request.args.get('amount'))
    except ValueError:
        error = "Amount value must be numerical"
    if not symbol_currency_from or not symbol_currency_to:
        error = "There are missing keys in JSON request, please read the documentation for help"
    if error is None:
        converted_value = None
        currency_obj = currency_dao.Currency(symbol_currency_from)
        usd_value_currency_from = currency_dao.retrieveValue(currency_obj)
        if usd_value_currency_from is None:
            error = "Expected currency 'from' currently does not exist"
        elif symbol_currency_to.upper() == "USD":
            converted_value = usd_value_currency_from * currency_amount
        else:
            currency_obj = currency_dao.Currency(symbol_currency_to)
            usd_value_currency_to = currency_dao.retrieveValue(currency_obj)
            if usd_value_currency_to is not None:
                converted_value = currency_amount * usd_value_currency_to / usd_value_currency_from
            else:
                error = "Expected currency 'to' currently does not exist"
        if converted_value != None:
            return jsonify({'convertedValue': converted_value}), 200
    return jsonify({'error': error}), 400


# API de criação de moeda
@bp.route('/createCurrency', methods = ['POST'])
def createNewCurrency():
    json_request = request.get_json()
    submission_keys = ['symbol','usd_value']
    error = None
    for k, v in json_request.items():
        if k in submission_keys:
            submission_keys.remove(k)
    if not submission_keys:
        symbol = json_request['symbol']
        keep_updated = None
        try:
            keep_updated = json_request['keep_updated']
        except KeyError:
            pass
        try:
            usd_value = float(json_request['usd_value'])
        except ValueError:
            error = "Input value as equivalent to USD must be numerical"
        if keep_updated is not None and keep_updated != True and keep_updated != False:
            error = "The value of keep updated must be true or false"
        new_currency = currency_dao.Currency(symbol, usd_value, keep_updated)
        if currency_dao.retrieveValue(new_currency) is not None:
            error = "Currency symbol already exists"
    else:
        error = "There are missing keys in JSON request, please read the documentation for help"
    if not error:
        currency_dao.create(new_currency)
        return jsonify({'message': 'Currency successfully created','error': None}), 200
    else:
        return jsonify({'message': 'An error has ocurred', 'error': error}), 400

    
# API de deleção de moeda
@bp.route('/deleteCurrency', methods = ['POST'])
def deleteCurrency():
    json_request = request.get_json()
    submission_keys = ['symbol']
    error = None
    for k, v in json_request.items():
        if k in submission_keys:
            submission_keys.remove(k)
    if not submission_keys:
        symbol = json_request['symbol']
        currency_to_delete = currency_dao.Currency(symbol)
        if currency_dao.retrieveValue(currency_to_delete) is None:
            error = "Currency symbol does not exists"
    else:
        error = "There are missing keys in JSON request, please read the documentation for help"
    if not error:
        currency_dao.delete(currency_to_delete)
        return jsonify({'message': 'Currency successfully deleted','error': None}), 200
    else:
        return jsonify({'message': 'An error has ocurred', 'error': error}), 400