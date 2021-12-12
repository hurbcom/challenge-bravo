import requests
from . import settings
from fastapi import HTTPException
from abc import ABC, abstractmethod
from models.operations import dbCurrencys
from sqlalchemy.orm import Session
import database

def defaultCurrencys():
        return settings.DEFAULT_CURRENCYS

class apiIntergration():
    
    def __init__(self) -> None:
        self.url = settings.BASE_URL
       
    def make_request(self, endpoint:str, method='GET', **kwargs):
        methods = {
            'GET': requests.get,
            'PUT': requests.put,
            'POST': requests.post
        }
        params = kwargs.get('params','')
        url = f'{self.url}/{endpoint}{params}'
        response = methods[method](url)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail='currency do not exist')


class currencyConversions(ABC):
    def __init__(self, currencyfrom='USD', currencyto='BRL') -> None:
        self.currencyfrom = currencyfrom
        self.currencyto = currencyto
    
    def calculate(self, amount, tx_conversion):
        return amount*float(tx_conversion)
    
    def checkApiCurrencys(self):
        response = self.apiIntegration.make_request(endpoint='json/available')
        
        return response.json()
    
    def checkdbCurrencys(self, db):
        db_currency = dbCurrencys(db)
        data = db_currency.getCurrencys(f'{self.currencyfrom}-{self.currencyto}')
        
        if data:                
            return {
                "buy": data.for_buy,
                "send":data.for_send,
                "last_update": data.last_update
            }
        
        raise HTTPException(status_code=404,detail='currency do not exist')
    
    @abstractmethod
    def executeConversion(self):
        pass

class apiCurrencyConversion(currencyConversions):
    
    def __init__(self, currencyfrom='USD', currencyto='BRL') -> None:
        self.apiIntegration = apiIntergration()
        super().__init__(currencyfrom=currencyfrom, currencyto=currencyto)
    
    def executeConversion(self):
        currencys = f'{self.currencyfrom}-{self.currencyto}'
        response = self.apiIntegration.make_request(endpoint=f'last/',params=currencys)
        
        return response[f'{self.currencyfrom}{self.currencyto}']

class dbCurrencyConversion(currencyConversions):
    def __init__(self, currencyfrom='USD', currencyto='BRL') -> None:
        super().__init__(currencyfrom=currencyfrom, currencyto=currencyto)
    
    def executeConversion(self, db):
        return self.checkdbCurrencys(db)


def execute(db, currencyfrom, currencyto, valueAmount):
    api = apiIntergration()
    response = api.make_request(endpoint='json/available')
    check = False
    
    for item in response:
        if item == f'{currencyfrom}-{currencyto}':
            check = True
    
    if check:
        api_conversion = apiCurrencyConversion(currencyfrom,currencyto)
        data = api_conversion.executeConversion()
        
        settings.CONVERSION["currency_conversion"] = f'{currencyfrom}-{currencyto}'
        settings.CONVERSION["value_amount"] = valueAmount
        settings.CONVERSION["values"]["for_buy"] = round(api_conversion.calculate(amount=valueAmount,tx_conversion=data['bid']),2)
        settings.CONVERSION["values"]["for_send"] = round(api_conversion.calculate(amount=valueAmount,tx_conversion=data['ask']),2)
        settings.CONVERSION["last_update"] = data['create_date']
        
        return settings.CONVERSION
    
    else:
        db_conversion = dbCurrencyConversion(currencyfrom,currencyto)
        data = db_conversion.executeConversion(db)
        
        settings.CONVERSION["currency_conversion"] = f'{currencyfrom}-{currencyto}'
        settings.CONVERSION["value_amount"] = valueAmount
        settings.CONVERSION["values"]["for_buy"] = round(db_conversion.calculate(amount=valueAmount,tx_conversion=data['buy']),2)
        settings.CONVERSION["values"]["for_send"] = round(db_conversion.calculate(amount=valueAmount,tx_conversion=data['send']),2)
        settings.CONVERSION["last_update"] = data['last_update']
        
        return settings.CONVERSION