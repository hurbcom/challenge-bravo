from brcurrency.dolar import Dolar
from brcurrency.bitcoin import Bitcoin
from brcurrency.euro import Euro
from brcurrency.ethereum import Ethereum
from flask import Response, current_app
from json import dumps
from .Coins import Coins
from src.utils.errors import UnprocessableEntityError


DEFAULT_COINS = {
    'USD': Dolar().get_cotacao(),
    'EUR': Euro().get_cotacao(),
    'BTC': Bitcoin().get_cotacao(),
    'ETH': Ethereum().get_cotacao(),
    'BRL': 1
}

class Calculate():
    def calculate(self, coin_from, coin_to, amount):
        value_from = self.__get_price(coin_from)
        value_to = self.__get_price(coin_to)
        result = (value_from / value_to) * amount
        return Response(dumps({'result': '{:.02f}'.format(result)}))

    def __get_price(self, name_coin:str):
        cached = current_app.cache.get(name_coin.upper())
        if cached:
            return cached
        if not name_coin.upper() in DEFAULT_COINS:
            price = Coins().read_by_name(name_coin)
            if not price:
                UnprocessableEntityError(f"{name_coin}  not registered.")
            
            current_app.cache.set(name_coin.upper(), price['price'], timeout=600)
            return price['price']
        else:
            price = DEFAULT_COINS[name_coin.upper()]
            current_app.cache.set(name_coin.upper(), price, timeout=600)
            return price


