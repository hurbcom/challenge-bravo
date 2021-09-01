# -*- coding: utf-8 -*-
"""
Created on Tue Aug 31 14:09:46 2021

@author: lucas
"""

import requests
import json
from flask import Flask, jsonify, request

class APICaller:
    def __init__(self):
        self
        self.base_url = "https://api.coinbase.com/v2/exchange-rates?currency"
        self.currencies_to_update = ''
        
        
    def currency_value(self, currency_from, currency_to):
        query = {'currency':currency_to}
        response = requests.get("https://api.coinbase.com/v2/exchange-rates", params=query)
        response_json = response.json()
        
        data = response_json['data'];
        if (data['currency'] is not currency_to):
            return 'Unexpected error while consulting price API'
        rates = data['rates']
        
        
        return response.json()
    
    def update_currency_value(self, currency):
        query = query = {'currency':currency}
        response = requests.get("https://api.coinbase.com/v2/exchange-rates", params=query)
        response_json = response.json()
        
        data = response_json['data'];
        if (data['currency'] != currency):
            return 'Unexpected error while consulting price API'
        rates = data['rates']
        
        for k,v in rates.items():
            print(k + ' ' + v)
            if k in self.currencies_to_update:
                #update currency rate to main currency
                print('a')
                
        return response.json();
                
    
       
