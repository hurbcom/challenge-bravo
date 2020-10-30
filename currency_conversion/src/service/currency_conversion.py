#-- Definition of currency conversion logic  --# 

from src.service.quote_api import get_quote_currency
from src.utils import status_code

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
        from_value_currency = self.convert_ballast_currency(from_currency_code)
        to_value_currency = self.convert_ballast_currency(to_currency_code)

        return format(float(from_value_currency / to_value_currency) * ammount, '.2f')