# -*- coding: utf-8 -*-
"""
Created on Tue Aug 31 14:09:46 2021

@author: lucas
"""

import requests
import json
from flask import Flask, jsonify, request
import currency_dao
import time
import atexit

from apscheduler.schedulers.background import BackgroundScheduler
  
def print_date_time():
    print(time.strftime("%A, %d. %B %Y %I:%M:%S %p"))


scheduler = BackgroundScheduler()
scheduler.add_job(func=print_date_time, trigger="interval", seconds=1)
scheduler.start()

atexit.register(lambda: scheduler.shutdown())

def update_currency_values(currency, currencies_to_update):
    query = query = {'currency':currency}
    response = requests.get("https://api.coinbase.com/v2/exchange-rates", params=query)
    response_json = response.json()
    
    data = response_json['data'];
    if (data['currency'] != currency):
        return 'Unexpected error while requesting price API'
    rates = data['rates']
    
    for k,v in rates.items():
        print(k + ' ' + v)
        if k in currencies_to_update:
            #update currency rate to main currency
            currency_up_to_date = currency_dao.Currency("USD", v)
            currency_dao.update(currency_up_to_date)
                
    
       
