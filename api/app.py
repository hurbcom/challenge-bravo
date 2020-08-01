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


@app.route('/currencies/', methods=['POST'])
def post_currencies():
    currency_id = request.json.get('id')
    result = redisConnector.hset('currencies', currency_id, 1)
    status = 201

    response = {
        'id': currency_id,
        'rate': 1
    }

    if not result:
        status = 409

    return Response(json.dumps(response), status=status, mimetype='application/json')


@app.route('/currencies/<string:currency>/', methods=['DELETE'])
def delete_currencies(currency):
    result = redisConnector.hdel('currencies', currency)
    response = {}
    status = 204

    if not result:
        status = 404

    return Response(json.dumps(response), status=status, mimetype='application/json')