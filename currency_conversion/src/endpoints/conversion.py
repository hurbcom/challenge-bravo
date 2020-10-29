#--- Setting endpoints for api ---#

from flask import Blueprint, jsonify

#import modules 
from src.schemas.currency import CurrencySchema
from src.business.currency import CurrencyBusiness

#define the blueprint name
currency_api = Blueprint(name="currency_api", import_name=__name__)

#define schemas 
currency_schema = CurrencySchema()
currencies_schema = CurrencySchema(many=True)

#endpoint to get all available currency codes
@currency_api.route('/conversion', methods=['GET'])
def all_currency_codes():
    
    get_currencies = CurrencyBusiness.get_all_currencies()
    return jsonify({'All Currency Codes': currencies_schema.dump(get_currencies)})

#endpoint to get currency conversion between two currencies by from_code, to_code and amount
@currency_api.route('/conversion/<string:from_code>/<string:to_code>/<int:ammount>', methods=['POST'])
def currency_conversion(from_code, to_code, ammount):

    return jsonify({'Value Converted': ""})

#endpoint to save currency code
@currency_api.route('/conversion/<string:currency_code>', methods=['POST'])
def add_currency(currency_code):

    CurrencyBusiness.insert_currency(currency_code)
    get_currencies = CurrencyBusiness.get_all_currencies()

    return jsonify({'Currency Codes': currencies_schema.dump(get_currencies)})

#endpoint to delete currency code
@currency_api.route('/conversion/<int:id>', methods=['DELETE'])
def delete_currency(id):

    CurrencyBusiness.delete_currency(id)
    get_currencies = CurrencyBusiness.get_all_currencies()

    return jsonify({'Currency Codes': currencies_schema.dump(get_currencies)})
