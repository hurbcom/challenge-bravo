import requests
import urllib3
from coin.serializers import CoinSerializer
from core.settings import CURRENCYLAYER_KEY
urllib3.disable_warnings()

coins_start = {
    'USD': 'United States Dollar',
    'BRL': 'Brazilian Real',
    'EUR': 'Euro',
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum'
}


def start_db_coin():
    try:
        print('\n ##### Start Database Coin ##### \n')
        resp = requests.get(
            f'http://api.currencylayer.com/live?access_key={CURRENCYLAYER_KEY}&currencies=USD,BRL,EUR&format=1', verify=False)
        coins = resp.json()['quotes']
        for coin in coins:
            data = {
                'code': coin[3:],
                'name': coins_start[coin[3:]],
                'value': coins[coin]
            }
            coin_serial = CoinSerializer(data=data)
            if coin_serial.is_valid():
                coin_serial.save()

        data = make_data_bit_coin('ETH')
        coin_serial = CoinSerializer(data=data)
        if coin_serial.is_valid():
            coin_serial.save()

        data = make_data_bit_coin('BTC')
        coin_serial = CoinSerializer(data=data)
        if coin_serial.is_valid():
            coin_serial.save()

    except Exception as e:
        pass


def get_value_bit_currenc(code):
    resp = requests.get(
        f'https://duckduckgo.com/js/spice/cryptonator/USD/{code}', verify=False)
    return resp.json()['ticker']['price']


def make_data_bit_coin(code: str):
    return {
        'code': code,
        'name': coins_start[code],
        'value': get_value_bit_currenc(code)
    }
