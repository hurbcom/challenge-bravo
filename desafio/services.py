
import json
import requests


class ServiceQuoteCurrencyPrice:

    def __init__(self, currency_base="USD", currencies_quote=[]):
        self.currency_base = currency_base
        self.currencies_quote = currencies_quote

    def get_currencies_quote(self):
        currencies_quote = ','.join(self.currencies_quote)
        qs = f"?fsym={self.currency_base}&tsyms={currencies_quote}"
        api_url_base = f"https://min-api.cryptocompare.com/data/price{qs}"

        response = requests.get(api_url_base)
        if response.status_code == 200:
            return json.loads(response.content.decode("utf-8"))
        else:
            return None

    def calc_currency_price_by_currencies_quote(self, value):
        currencies_quote = self.get_currencies_quote()
        return {currency: round(value * price, 4) for currency,
                price in currencies_quote.items()}
