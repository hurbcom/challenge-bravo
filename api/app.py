import json

from flask import Flask, Response, request
app = Flask(__name__)


@app.route('/convert/')
def currency_converter():
    currency_from = request.args.get('from', 'USD')
    currency_to = request.args.get('to', 'BRL')
    amount = request.args.get('amount', 1, type=int)
    value = 5.15

    if currency_from == 'BRL':
        value = 0.19

    response = {
        'from': currency_from,
        'to': currency_to,
        'amount': amount,
        'value': value
    }

    return Response(json.dumps(response), status=200, mimetype='application/json')