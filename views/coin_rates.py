import os
import json
from flask import request
from flask import jsonify
from db.redis import connect_to_redis
import requests

from utils.urls import URL_GET_USD_RATES



def get_coin_rates_external_api():
    key = os.environ.get('COIN_API_KEY')
    result = requests.get(URL_GET_USD_RATES, headers={'X-CoinAPI-Key': key})
    if result.status_code == 200:
        dict_result = json.loads(result.content)
        dict_weather = dict_result['rates'][0]
        dict_main = dict_result['main']
        formated_result = {
            'description': dict_weather['description'],
            'icon': dict_weather['icon'],
            'name': dict_result['name'],
            'temp': dict_main['temp'],
            'temp_min': dict_main['temp_min'],
            'temp_max': dict_main['temp_max']
        }
        return formated_result
    return jsonify({'error': 'not found'}), 400

