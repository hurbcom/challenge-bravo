import json

from flask import Response, request
from api.app import app
from api.models import Currencies


@app.route('/convert/')
def currency_converter():
    currency_from_id = request.args.get('from', 'USD')
    currency_to_id = request.args.get('to', 'BRL')
    amount = request.args.get('amount', 1, type=float)

    if amount < 0:
        amount = amount * -1

    currency_from = Currencies.get(currency_from_id)
    currency_to = Currencies.get(currency_to_id)

    if not currency_from or not currency_to:
        response = {}
        status = 404
    else:
        value = round(amount / currency_from.rate * currency_to.rate, 2)

        response = {
            'from': currency_from_id,
            'to': currency_to_id,
            'amount': amount,
            'value': value
        }

        status = 200

    return Response(
        json.dumps(response),
        status=status,
        mimetype='application/json'
    )