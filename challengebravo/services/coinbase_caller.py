# -*- coding: utf-8 -*-
"""
Created on Tue Aug 31 14:09:46 2021

@author: lucas
"""

import requests
from ..db import currency_dao

def update_currency_values():
    currencies_to_update = currency_dao.retrieveCurrenciesToUpdate()
    currency = 'USD'
    query = {'currency':currency}
    response = requests.get("https://api.coinbase.com/v2/exchange-rates", params=query)
    response_json = response.json()
    data = response_json['data']
    if (data['currency'] != currency):
        return 'Unexpected error while requesting price API'
    rates = data['rates']
    for k,v in rates.items():
        if k in currencies_to_update:
            #update currency rate to main currency
            currency_up_to_date = currency_dao.Currency(k, v)
            currency_dao.update(currency_up_to_date)
                
    
       
