import requests


def get_quote(currrency_from: str, currency_to: str) -> float:
    url = 'https://api.coinbase.com/v2/exchange-rates'

    response = requests.get(url, params={'currency': currrency_from})

    response_data = response.json()

    return float(response_data['data']['rates'][currency_to])
