import json
import redis

from flask import Flask, Response, request
app = Flask(__name__)

redisConnector = redis.Redis(host='db', port=6379, db=0, password='sOmE_sEcUrE_pAsS', encoding="utf-8", decode_responses=True)


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


@app.route('/currencies/', methods=['GET'])
def currencies():
    currencies = redisConnector.hgetall('currencies')
    results = []

    for currency in currencies.items():
        results.append({
            'id': currency[0],
            'rate': float(currency[1])
        })

    response = {
        'count': len(results),
        'results': results
    }
    return Response(json.dumps(response), status=200, mimetype='application/json')