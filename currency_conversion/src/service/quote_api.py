#-- Connection to the quote api (Awesome API)--#

import requests

def get_quote_currency(currency):
    response = requests.get('https://economia.awesomeapi.com.br/json/all/{currency}-BRL'.format(currency = currency))
    return float(response.json()[currency]['high'])

