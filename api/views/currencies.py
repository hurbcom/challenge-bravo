import json

from flask import Response, request
from api.app import app
from api.models import Currencies

JSON = 'application/json'


@app.before_first_request
def startup():
    currencies = Currencies.all()

    if len(currencies) == 0:
        for currency in ['USD', 'BRL', 'EUR', 'BTC', 'ETH']:
            Currencies.create(currency)


@app.route('/currencies/', methods=['GET'])
def currencies():
    currencies = Currencies.all()

    response = json.dumps({
        'count': len(currencies),
        'results': [currency.to_dict() for currency in currencies]
    })

    return Response(response, mimetype=JSON)


@app.route('/currencies/', methods=['POST'])
def post_currencies():
    currency_id = request.json.get('id')
    created, new_currency = Currencies.create(currency_id)

    if created:
        status = 201
    else:
        status = 409

    response = json.dumps(new_currency.to_dict())
    return Response(response, status=status, mimetype=JSON)


@app.route('/currencies/<string:currency_id>/', methods=['DELETE'])
def delete_currencies(currency_id):
    currency = Currencies.get(currency_id)

    if currency:
        currency.delete()
        status = 204
    else:
        status = 404

    return Response('{}', status=status, mimetype=JSON)