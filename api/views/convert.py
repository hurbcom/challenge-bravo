import json

from flask import Response, request
from api.app import app, redisConnector


@app.route('/convert/')
def currency_converter():
    currency_from = request.args.get('from', 'USD')
    currency_to = request.args.get('to', 'BRL')
    amount = request.args.get('amount', 1, type=int)

    currency_from_rate = redisConnector.hget('currencies', currency_from)
    currency_to_rate = redisConnector.hget('currencies', currency_to)

    if not currency_from_rate or not currency_to_rate:
        return Response(json.dumps({}), status=404, mimetype='application/json')

    value = amount / float(currency_from_rate) * float(currency_to_rate)

    response = {
        'from': currency_from,
        'to': currency_to,
        'amount': amount,
        'value': float(f'{value:.2f}')
    }

    return Response(json.dumps(response), status=200, mimetype='application/json')