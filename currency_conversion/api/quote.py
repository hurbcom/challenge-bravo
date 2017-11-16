import requests
from flask import current_app


class Quote:

    BRL_EUR = 'http://api.fixer.io/latest?base=USD'
    ETH_BTC = 'https://cex.io/api/last_price/{}/USD'

    def __init__(self, from_coin, to_coin):
        self.from_coin = from_coin
        self.to_coin = to_coin
        self.ballast = 'USD'

    def get(self):
        if self.to_coin == self.ballast:
            result = self.format_quote(self.convert_ballast_to())
        elif self.from_coin == self.ballast:
            result = self.format_quote(self.convert_ballast_from())
        else:
            result = self.format_quote(self.convert_from_to_quote())

        return result

    def convert_ballast_to(self):
        from_to = self.from_coin + self.to_coin
        quote_from_value = self.get_json_api_quote(from_to)
        return 1 / quote_from_value

    def convert_ballast_from(self):
        to_from = self.to_coin + self.from_coin
        quote_to_value = self.get_json_api_quote(to_from)
        return quote_to_value

    def convert_from_to_quote(self):
        from_to = self.from_coin + self.to_coin
        quote_from_value = self.get_json_api_quote(from_to)

        to_from = self.to_coin + self.from_coin
        quote_to_value = self.get_json_api_quote(to_from)
        return quote_from_value / quote_to_value

    def get_json_api_quote(self, type):
        get_value_redis = float(current_app.redis.get(type))
        get_get_from_type = type[:3]

        if get_value_redis:
            value = get_value_redis
        else:
            if get_from_type in('BRL', 'EUR'):
                get_json = requests.get(self.BRL_EUR)
                coin_json = get_json.json()
                current_app.redis.set(
                    type,
                    str(coin_json['rates'][type[2]]),
                    ex=30000)
                value = self.format_quote(coin_json['rates'][get_from_type])
            else:
                get_json = requests.get(self.ETH_BTC.format(get_from_type))
                coin_json = get_json.json()
                current_app.redis.set(
                    type,
                    str(coin_json['lprice']),
                    ex=30000)
                value = self.format_quote(float(coin_json['lprice']))

        return value

    def format_quote(self, quote):
        return float("{0:4.4f}".format(quote))
