from flask import Blueprint, request, jsonify
from currency_conversion.api.conversion import Conversion
from currency_conversion.api.validate import *


conversion = Blueprint('conversion', __name__)

# ?from=BRL&to=USD&amount=1
@conversion.route('/conversion', methods=['GET'])
def get_conversion():
    coin_from = request.args.get('from')
    coin_to = request.args.get('to')
    amount = request.args.get('amount')

    if not all((validate_from(coin_from),
        validate_to(coin_to), validate_amount(amount))):
        return jsonify({'message': 'Invalid data'}), 400
    else:
        conversion = Conversion(coin_from, coin_to, float(amount))
        value = conversion.get()
        return jsonify({
                'data': {
                    'from': {
                        'coin': coin_from,
                        'quote': conversion.get_from_quote
                    },
                    'to': {
                        'coin': coin_to,
                        'quote': conversion.get_to_quote
                    },
                    'amount': amount,
                    'converted_amount': value
                }
            }), 200

