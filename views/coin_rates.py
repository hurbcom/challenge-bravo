import logging
import os
import json
from flask import request, jsonify
from db.redis import connect_to_redis
import requests

from utils.urls import URL_GET_USD_RATES


def set_coin_rates_external_api_to_redis():
    with connect_to_redis() as redis:
        flag_is_cache_alive = redis.exists('isCacheAlive')
        if flag_is_cache_alive:
            return
        key = os.environ.get('COIN_API_KEY')
        ttl = os.environ.get('TIME_TO_LIVE', 300)
        result = requests.get(URL_GET_USD_RATES, headers={'X-CoinAPI-Key': key})
        redis.set('isCacheAlive', 1, ex=ttl)
        logging.info("Setting redis cache")
        if result.status_code == 200:
            dict_result = json.loads(result.content)
            result = dict_result['rates']
            redis.set('isCacheAlive', 1, ex=ttl)
            redis.set('USD', 1, ex=ttl)
            for item in result:
                redis.set(item.get('asset_id_quote'), item.get('rate'), ex=ttl)


def convert_two_currencies():
    with connect_to_redis() as redis:
        set_coin_rates_external_api_to_redis()
        args = request.args
        from_currency, to_currency, amount = args.get('from'), args.get('to'), args.get('amount')
        from_rate, to_rate = tuple(redis.mget(from_currency, to_currency))
        if not from_rate or not to_rate:
            return json.dumps({'error': 'One or more rates not found, try another! :)'})
        from_amount_in_usd = float(amount)/float(from_rate)
        result_conversion = from_amount_in_usd * float(to_rate)
        return jsonify({'convertedValue': result_conversion})


def set_fake_coin_to_redis():
    with connect_to_redis() as redis:
        try:
            request_body = json.loads(request.data)
            redis.set(request_body['rateName'], request_body['usdValue'])
            return jsonify({"message": f'success to register {request_body["rateName"]} to the database!'})
        except Exception as e:
           return jsonify({"error": "Error while executing the rate registering process! Sorry"})


def remove_rate_from_redis():
    with connect_to_redis() as redis:
        try:
            request_body = json.loads(request.data)
            redis.delete(request_body['rateName'])
            return jsonify({"message": f'success to delete {request_body["rateName"]} from the database!'})
        except Exception as e:
            return jsonify({"error": "Error while executing the rate deleting process! Sorry"})