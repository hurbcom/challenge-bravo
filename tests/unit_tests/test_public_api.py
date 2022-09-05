import requests



def test_response_contains_all_required_coins():
    """ Makes a GET request to the third party API and verify if the main currencies (`USD`,`BRL`,`EUR`,`BTC`,`ETH`) are returned """
    res = requests.get('https://api.coinbase.com/v2/exchange-rates', params={'currency': 'USD'})
    currencies: dict = res.json()['data']['rates']

    must_have_currencies = ["USD", "BRL", "EUR", "BTC", "ETH"]
    for currency in must_have_currencies:
        assert currency in currencies.keys()