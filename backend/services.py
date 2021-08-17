import requests
from django.conf import settings

from backend.core.models import MyCoin


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
        mycoin_from = MyCoin.objects.filter(codecoin=self._from_coin).first()
        mycoin_price_from = 1
        if mycoin_from:
            mycoin_price_from = mycoin_from.price
            self._from_coin = 'USD'

        mycoin_to = MyCoin.objects.filter(codecoin=self._to_coin).first()
        mycoin_price_to = 1
        if mycoin_to:
            mycoin_price_to = mycoin_to.price
            self._to_coin = 'USD'

        if mycoin_from and mycoin_to:
            return (self._amount * (mycoin_price_from / mycoin_price_to))

        apicoin = ApiCoin()
        convert = apicoin.set_convert(self._from_coin, self._to_coin)

        if not isinstance(convert, int) and convert:
            value_api_coin = convert[f'{self._from_coin}_{self._to_coin}']
            if mycoin_price_from > 1:
                value_convert = (self._amount * (
                    value_api_coin * mycoin_price_from
                ))
            elif mycoin_price_to > 1:
                value_convert = (self._amount * (
                    value_api_coin / mycoin_price_to
                ))
            else:
                value_convert = (self._amount * value_api_coin)
            return value_convert

        return 0
