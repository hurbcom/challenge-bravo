import requests
from django.conf import settings


class ApiCoin():

    def __init__(self):
        self.api = settings.API_COIN
        self.api_key = settings.API_COIN_KEY

    def set_convert(self, from_coin, to_coin):
        response = requests.get(
            f'{self.api}/convert?q={from_coin}_{to_coin}&compact=ultra&'
            f'apiKey={self.api_key}')
        if response.status_code == 200:
            return response.json()
        else:
            return response.status_code

    def get_currencies(self):
        response = requests.get(
            f'{self.api}/currencies?apiKey={self.api_key}'
        )
        if response.status_code == 200:
            return response.json()['results']
        else:
            return response.status_code


class Convert():

    def __init__(self, from_coin, to_coin, amount):
        self._from_coin = from_coin
        self._to_coin = to_coin
        self._amount = amount

    def set_convert(self):
        apicoin = ApiCoin()
        convert = apicoin.set_convert(self._from_coin, self._to_coin)

        if convert:
            value_convert = (
                self._amount * convert[f'{self._from_coin}_{self._to_coin}']
            )
            return value_convert

        return 0
