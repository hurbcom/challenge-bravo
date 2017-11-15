import requests
from redis import Redis


class Quote:

    BRL_EUR = 'https://api.fixer.io/latest?base=USD'
    ETH_BTC = 'https://cex.io/api/last_price/{}/USD'

    def __init__(self, from_coin, to_coin):
        self.from_coin = from_coin
        self.to_coin = to_coin
        self.ballast = 'USD'
        self.redis = Redis(host='redis')

    def get(self):
        if self.to_coin == self.ballast:
            result = self.format_quote(self.convert_ballast_to())
        elif self.from_coin == self.ballast:
            result = self.format_quote(self.convert_ballast_from())
        else:
            result = self.format_quote(self.convert_from_to_quote())

        return result

    def convert_ballast_to(self):
        quote_from_value = self.get_json_api_quote(self.from_coin)
        return 1 / quote_from_value

    def convert_ballast_from(self):
        quote_to_value = self.get_json_api_quote(self.to_coin)
        return quote_to_value

    def convert_from_to_quote(self):
        quote_from_value = self.get_json_api_quote(self.from_coin)
        quote_to_value = self.get_json_api_quote(self.to_coin)
        return quote_from_value / quote_to_value

    def get_json_api_quote(self, type):
        if type in('BRL', 'EUR'):
            if self.redis.get(self.from_to):
                value = self.format_quote(float(self.redis.get(self.from_to)))
            else:
                get_json = requests.get(self.BRL_EUR)
                coin_json = get_json.json()
                self.redis.set(
                    self.from_to,
                    str(coin_json['rates'][type]),
                    ex=100)
                value = self.format_quote(coin_json['rates'][type])
        else:
            if self.redis.get(self.from_to):
                value = self.format_quote(float(self.redis.get(self.from_to)))
            else:
                get_json = requests.get(self.ETH_BTC.format(type))
                coin_json = get_json.json()
                self.redis.set(
                    self.from_to,
                    str(coin_json['lprice']),
                    ex=100)
                value = self.format_quote(float(coin_json['lprice']))

        return value

    def format_quote(self, quote):
        return float("{0:4.4f}".format(quote))

    @property
    def from_to(self):
        return self.from_coin + '_' + self.to_coin
