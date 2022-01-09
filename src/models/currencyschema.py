from server.server import *
from models.currencymodel import Currency

class CurrencySchema(server.database.ma.Schema):
    class Meta:
        fields = Currency.visible_fields
        model = Currency

    def currenciesSchemaCacheDict(currencies):
        cache_dict = {}
        for currency in currencies:
            cache_dict[currency['name']] = currency['value']

        return cache_dict

    def getCurrencyResponseFromJson(json):
        return {json['name'] : json['value'] }

currency_schema = CurrencySchema()
currencies_schema = CurrencySchema(many=True)