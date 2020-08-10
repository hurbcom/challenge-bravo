
import json
import requests


class ServiceQuoteCurrencyPrice:

    def __init__(self, symbol_currency="USD", currencies_quote=[]):
        self.symbol_currency = symbol_currency
        self.currencies_quote = currencies_quote
        self.key_free = "0314b77f13f7e7cfdb2012974d2a2573e8c4d72d1ad07d4a5b8f45053b81d16b"

    def get_currencies_quote(self):
        currencies_quote = ','.join(self.currencies_quote)
        qs = f"?fsym={self.symbol_currency}&tsyms={currencies_quote}"
        api_url_base = f"https://min-api.cryptocompare.com/data/price{qs}"

        response = requests.get(api_url_base)
        if response.status_code == 200:
            print(response.content)
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
        print(currencies_quote)
        return {currency: round(amount * price, 4) for currency,
                price in currencies_quote.items()}
