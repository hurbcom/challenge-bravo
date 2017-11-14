from flask import Blueprint, request, jsonify
from currency_conversion.api.conversion import Conversion


conversion = Blueprint('conversion', __name__)

# ?from=BRL&to=USD&amount=1
@conversion.route('/conversion')
def get_conversion():
    coin_from = request.args.get('from')
    coin_to = request.args.get('to')
    amount = float(request.args.get('amount'))

    conversion = Conversion(coin_from, coin_to, amount)
    value = conversion.get()

    return jsonify({'result': {
            'from': coin_from,
            'to': coin_to,
            'amount': amount,
            'converted_amount': value
        }}), 201
