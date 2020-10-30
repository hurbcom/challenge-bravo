#-- Connection to the quote api (Awesome API)--#

import requests
from src.utils import status_code

def get_quote_currency(currency):
    response = requests.get('https://economia.awesomeapi.com.br/json/all/{currency}-BRL'.format(currency = currency))
    return float(response.json()[currency]['high'])
    


