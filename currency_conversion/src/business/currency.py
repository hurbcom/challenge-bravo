#--- Define Currency methods to access database ---#

from src.models.currency import Currency
from src.db import db 
from src.utils import status_code
from flask_sqlalchemy import event


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
                
                return status_code.SUCESSFUL_REGISTRATION_201
            else:
                return status_code.CONFLICT_409
        except:
            db.session.rollback()
            return status_code.INTERNAL_SERVER_ERROR_500

    
    #get all currencies codes 
    @classmethod
    def get_all_currencies(self):

        try:
            get_all_currencies = Currency.query.all()
            return get_all_currencies
        except:
            return status_code.INTERNAL_SERVER_ERROR_500
    
    #get currency code by id
    @classmethod
    def get_by_id(self, currency_id):
        try:
            get_currency = Currency.query.filter(Currency.id == currency_id).first()
            return get_currency
        except:
            return status_code.INTERNAL_SERVER_ERROR_500
        
    #delete currency code by id 
    @classmethod
    def delete_currency(self, currency_id):
        try:
            get_currency = self.get_by_id(currency_id)

            if(get_currency is not None):
                db.session.delete(get_currency)
                db.session.commit()

                return status_code.SUCCESFUL_REMOVE_200
            else:
                return status_code.NOT_FOUND_404
        except:
            return status_code.INTERNAL_SERVER_ERROR_500

    #check if currency code already exists in database
    @classmethod
    def currency_code_exists(self, currency_code):
        try:
            get_currency_code = Currency.query.filter(Currency.currency_code == currency_code).first()

            if(get_currency_code is not None):
                return True
            else:
                return False
        except:
            return status_code.INTERNAL_SERVER_ERROR_500

        