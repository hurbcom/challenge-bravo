import requests

from django.core.cache import cache

from currency.utils.constants import CACHE_TTL_IN_SECONDS

def get_quote(currency_from: str, currency_to: str) -> float:
    cache_key = currency_from + currency_to
    if result := cache.get(cache_key):
        return result

    url = 'https://api.coinbase.com/v2/exchange-rates'

    response = requests.get(url, params={'currency': currency_from})

    response_data = response.json()
    quotation = float(response_data['data']['rates'][currency_to])

    cache.set(cache_key, quotation, CACHE_TTL_IN_SECONDS)
    return quotation
