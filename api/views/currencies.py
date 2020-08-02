import json

from flask import Response, request
from api.app import app
from api.models import Currencies


@app.route('/currencies/', methods=['GET'])
def currencies():
    currencies = Currencies.all()

    response = {
        'count': len(currencies),
        'results': [currency.to_dict() for currency in currencies]
    }

    return Response(json.dumps(response), status=200, mimetype='application/json')


@app.route('/currencies/', methods=['POST'])
def post_currencies():
    currency_id = request.json.get('id')
    created, new_currency = Currencies.create(currency_id, 1)

    if created:
        status = 201
    else:
        status = 409

    return Response(json.dumps(new_currency.to_dict()), status=status, mimetype='application/json')


@app.route('/currencies/<string:currency_id>/', methods=['DELETE'])
def delete_currencies(currency_id):
    currency = Currencies.get(currency_id)

    if currency:
        currency.delete()
        status = 204
    else:
        status = 404

    return Response('{}', status=status, mimetype='application/json')