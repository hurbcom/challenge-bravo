#!/usr/bin/env python
# -*- coding: utf-8 -*- 
import sys, os

import json, re, datetime
from flask_restful import Resource
from flask import request, Flask
from exchange_rates import usd_rates

class Convert(Resource):

    #GET da api que retorna a moeda convertida
    def get(self):
        coins_regex = "(\AUSD\Z)|(\ABRL\Z)|(\AEUR\Z)|(\ABTC\Z)|(\AETH\Z)"
        try:
            base = request.args.get('base', '')
            target = request.args.get('target', '')
            value = float(request.args.get('value', 1))
            
            if base == '' or target == '':   
                return {'Erro': 'Consulta invalida', 'Exemplo valido':'<url>/api/convert?base=USD&target=BRL&value=1'}, 400
            if not re.match(coins_regex, base.upper()) or not re.match(coins_regex, target.upper()):
                return {'Erro': 'Moedas nao suportadas'}, 400
            if value == 0:
                value = 1

            exchangePrice = self.__get_exchange(base, target)
            data = { f'Valor de Cambio {base.upper()} para {target.upper()}': exchangePrice, 'Valor Total Convertido': exchangePrice * value, 'Data': str(datetime.datetime.today()) }
            
            return data

        except:
            return {'Error': 'Request failed'}, 400
    
    # Reliza a conversão
    def __get_exchange(self, base, target):
        return (1 / usd_rates[base.upper()]) / (1 / usd_rates[target.upper()])
