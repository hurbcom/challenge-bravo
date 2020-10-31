#-- Definition of currency conversion logic  --# 

from src.service.quote_api import get_quote_currency
from src.utils import status_code
from src.business.currency import CurrencyBusiness

class Currency_Conversion():

    #get quote by currency code 
    @classmethod
    def get_value_currency(self, currency_code):
        return get_quote_currency(currency_code)

    #conversion of quote to ballast currency (USD)
    @classmethod
    def convert_ballast_currency(self, currency_code):
        ballast_value = get_quote_currency("USD")

        if(currency_code == "BRL"):
            value_currency = 1
        else:
            value_currency = get_quote_currency(currency_code)
        
        return value_currency / ballast_value

    #calculate currency conversion between two currencies and ammount
    @classmethod
    def calculate_conversion(self, from_currency_code, to_currency_code, ammount):
        
        try:
            #check if currency code exists in database
            get_from_code = CurrencyBusiness.currency_code_exists(from_currency_code)
            get_to_code = CurrencyBusiness.currency_code_exists(to_currency_code)

            if(get_from_code and get_to_code):
                from_value_currency = self.convert_ballast_currency(from_currency_code)
                to_value_currency = self.convert_ballast_currency(to_currency_code)

                value_converted = format(float(from_value_currency / to_value_currency) * ammount, '.2f')
                return {"value": value_converted, "status": 200}
            else:
                return status_code.NOT_FOUND_DB_405
        except:
            return status_code.NOT_SUPPORTED_CODE_500