#--- Define Currency methods to access database ---#

from src.models.currency import Currency
from src.db import db 
from flask_api import status


class CurrencyBusiness(object):

    #insert currency code (param=currency_code) to database
    @classmethod
    def insert_currency(self, currency_code):
        try:
            
            currency = Currency(currency_code=currency_code)
            currency_exits = self.currency_code_exists(currency_code)

            if(not currency_exits):
                db.session.add(currency)
                db.session.commit()
                
                return status.HTTP_201_CREATED

            else:
                return status.HTTP_400_BAD_REQUEST
        except:
            db.session.rollback()
            return status.HTTP_500_INTERNAL_SERVER_ERROR

    
    #get all currencies codes 
    @classmethod
    def get_all_currencies(self):
        return Currency.query.all()
    
    #get currency code by id
    @classmethod
    def get_by_id(self, currency_id):
        return Currency.query.filter(Currency.id == currency_id).one()

    #delete currency code by id 
    @classmethod
    def delete_currency(self, currency_id):
        try:
            get_currency = self.get_by_id(currency_id)
            db.session.delete(get_currency)
            db.session.commit()
        except:
            db.session.rollback()

    #check if currency code already exists in database
    @classmethod
    def currency_code_exists(self, currency_code):
        get_currency_code = Currency.query.filter(Currency.currency_code == currency_code).first()
        
        if(get_currency_code is not None):
            return True
        else:
            return False

    
        