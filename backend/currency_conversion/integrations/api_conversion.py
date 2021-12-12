import requests
from . import settings
from fastapi import HTTPException
from abc import ABC, abstractmethod
from models.operations import dbCurrencys

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
    
    def checkApiCurrencys(self):
        response = self.make_request(endpoint='json/available')
        
        return response


class dbIntegrations():
    def __init__(self, db, currencyfrom=None, currencyto=None) -> None:
        self.db = db
        self.currencyfrom = currencyfrom
        self.currencyto = currencyto
    
    def dbCheckCurrency(self):
        db_currency = dbCurrencys(self.db)
        data = db_currency.getCurrencys(f'{self.currencyfrom}-{self.currencyto}')

        if data:                
            return {
                f"{self.currencyfrom}-{self.currencyto}":f"{data.name}",
                "buy": data.for_buy,
                "send":data.for_send,
                "last_update": data.last_update
            }
        
        raise HTTPException(status_code=404,detail='currency do not exist')
    
    def dbCurrencyAvailable(self):
        try:
            db_currency = dbCurrencys(self.db)
            data = db_currency.getallCurrencys()[0]
            if data:
                return{
                    f"{data.currency}":f"{data.name}"
                }
        except:
            return {}
            

class currencyConversions(ABC):
    def __init__(self, currencyfrom='USD', currencyto='BRL') -> None:
        self.currencyfrom = currencyfrom
        self.currencyto = currencyto
    
    def calculate(self, amount, tx_conversion):
        return amount*float(tx_conversion)
    
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
    def __init__(self, db ,currencyfrom='USD', currencyto='BRL') -> None:
        super().__init__(currencyfrom=currencyfrom, currencyto=currencyto)
        self.dbIntegration = dbIntegrations(db,currencyfrom,currencyto)
    
    def executeConversion(self):
        return self.dbIntegration.dbCheckCurrency()