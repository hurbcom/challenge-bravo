# -*- coding: utf-8 -*-
"""
Created on Tue Aug 31 14:09:46 2021

@author: lucas
"""

import requests
import json
from flask import Flask, jsonify, request
from . import currency_dao
import time
import atexit

# from apscheduler.schedulers.background import BackgroundScheduler
  
# def currency_updater():
#     with app.app_context():
#         print(time.strftime("%A, %d. %B %Y %I:%M:%S %p"))
#         update_currency_values()
#     print(time.strftime("%A, %d. %B %Y %I:%M:%S %p"))


# scheduler = BackgroundScheduler()
# scheduler.add_job(func=currency_updater, trigger="interval", seconds=1)
# scheduler.start()

# atexit.register(lambda: scheduler.shutdown())

def update_currency_values():
    currencies_to_update = currency_dao.retrieveCurrencies()
    print(currencies_to_update)
    currency = 'USD'
    query = {'currency':currency}
    response = requests.get("https://api.coinbase.com/v2/exchange-rates", params=query)
    response_json = response.json()
    data = response_json['data'];
    if (data['currency'] != currency):
        return 'Unexpected error while requesting price API'
    rates = data['rates']
    
    for k,v in rates.items():
        if k in currencies_to_update:
            #update currency rate to main currency
            currency_up_to_date = currency_dao.Currency(k, v)
            currency_dao.update(currency_up_to_date)
            print(currency_dao.retrieveValue(currency_up_to_date))
                
    
       
