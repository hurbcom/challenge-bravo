
import json
import requests


class ServiceQuoteCurrencyPrice:

    def __init__(self, symbol_currency="USD", currencies_quote=[]):
        self.symbol_currency = symbol_currency
        self.currencies_quote = currencies_quote
        self.key_free = "8dd7e72df5931f3f65993c10baebecaaf4dbe39ce879a2aee00c076b1eafd46a"

    def get_currencies_quote(self):
        currencies_quote = ','.join(self.currencies_quote)
        qs = f"?fsym={self.symbol_currency}&tsyms={currencies_quote}"
        api_url_base = f"https://min-api.cryptocompare.com/data/price{qs}"
        try:
            response = requests.get(api_url_base)
        except requests.exceptions.ConnectionError:
            return {'error': f'Foi execedido o maximo de requisições para: {api_url_base}'}

        if response.status_code == 200:
            return json.loads(response.content.decode("utf-8"))
        else:
            return None

    def find_symbol_currency(self, symbol_currency):
        qs = f"?fsym={symbol_currency}&api_key={self.key_free}"
        api_url_base = f"https://min-api.cryptocompare.com/data/v2/pair/mapping/fsym{qs}"

        response = requests.get(api_url_base)

        if response.status_code == 200:
            return json.loads(response.content.decode("utf-8"))
        else:
            return None

    def calc_currency_price_by_currencies_quote(self, amount):

        currencies_quote = self.get_currencies_quote()

        if 'error' in currencies_quote.keys():
            return currencies_quote
        if 'Response' in currencies_quote.keys():
            raise ValueError

        return {currency: round(amount * price, 2) for currency,
                price in currencies_quote.items()}
