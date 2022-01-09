from server.server import *
from models.currencymodel import Currency

class CurrencySchema(server.database.ma.Schema):
    class Meta:
        fields = Currency.fields
        model = Currency

    def currenciesSchemaNameList(currencies):
        name_list = []
        for currency in currencies:
            name_list.append(currency['name'])

        return name_list

currency_schema = CurrencySchema()
currencies_schema = CurrencySchema(many=True)