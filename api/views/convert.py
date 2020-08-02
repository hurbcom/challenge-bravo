import json

from flask import Response, request
from api.app import app, redisConnector
from api.models import Currencies


@app.route('/convert/')
def currency_converter():
    currency_from_id = request.args.get('from', 'USD')
    currency_to_id = request.args.get('to', 'BRL')
    amount = request.args.get('amount', 1, type=int)

    currency_from = Currencies.get(currency_from_id)
    currency_to = Currencies.get(currency_to_id)

    if not currency_from or not currency_to:
        response = {}
        status = 404
    else:
        value = amount / currency_from.rate * currency_to.rate

        response = {
            'from': currency_from.currency_id,
            'to': currency_to.currency_id,
            'amount': amount,
            'value': float(f'{value:.2f}')
        }

        status = 200

    return Response(
        json.dumps(response),
        status=status,
        mimetype='application/json'
    )