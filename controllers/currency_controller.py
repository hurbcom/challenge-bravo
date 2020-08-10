from flask import Blueprint, jsonify, request
from models.currency import Currency


currency_controller = Blueprint('currency', __name__)


@currency_controller.route('/', methods=['GET'])
def index():
    if 'from' not in request.args or 'to' not in request.args or 'amount' not in request.args:
        return jsonify({"error": "Arguments missing"}), 412

    currency_from = request.args.get('from')
    currency_to = request.args.get('to')
    amount = request.args.get('amount')

    try:
        amount = float(amount)
    except:
        return jsonify({"error": "Invalid Amount Format"}), 412

    c1 = Currency()
    c2 = Currency()

    c_from = c1.find_by_symbol(currency_from)
    c_to = c2.find_by_symbol(currency_to)

    # Verifico a existencia das moedas no banco
    if not c_to or not c_from:
        return jsonify({"error": "Currency not Found"}), 404
    if "value" not in c_from or "value" not in c_from:
        return jsonify({"error": "Currency not Found"}), 404

    # Ex: valor convertido = (valorBRL / valorEUR) * valor a converter
    converted_amount = (c_to["value"] / c_from["value"]) * amount

    json_res = {
        "original": {
            "currency": currency_from,
            "value": amount
        },
        "converted": {
            "currency": currency_to,
            "value": converted_amount
        },
        "_links": {
            "url": request.url,
            "list_all_currencys": request.url_root + "currencies",
            "usd_to_currency_from": request.url_root + "currencies/" + currency_from,
            "usd_to_currency_to": request.url_root + "currencies/" + currency_to,
        }
    }

    return jsonify(json_res), 200
    

@currency_controller.route('/currencies', methods=['GET'])
def get_tasks():
    c = Currency()
    return jsonify(c.find({})), 200


@currency_controller.route('/currencies/<string:symbol>/', methods=['GET'])
def get_all_currencies(symbol):
    c = Currency()
    return c.find_by_symbol(symbol), 200


@currency_controller.route('/currencies/', methods=['POST'])
def add_currency():
    if request.method == "POST":
        c = Currency()
        symbol = request.get_json()['symbol'].upper()

        response_message, response_status = c.create({'symbol': symbol})
        if response_status == 201:
            return jsonify({"message": response_message}), response_status
        else:
            return jsonify({"error": response_message}), response_status


@currency_controller.route('/currencies/<string:symbol>', methods=['DELETE'])
def delete_currency(symbol):
    if request.method == "DELETE":
        c = Currency()
        if c.delete(symbol.upper()):
            return jsonify({"message": symbol.upper() + " removed successfully"}), 200
    
    return jsonify({"error": "Unable to delete currency"}), 404