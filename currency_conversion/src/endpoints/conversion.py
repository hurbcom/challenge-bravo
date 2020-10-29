#--- Setting endpoints for api ---#

from flask import Blueprint, jsonify

#define the blueprint name
currency_api = Blueprint(name="currency_api", import_name=__name__)


#endpoint to get all available currency codes
@currency_api.route('/conversion', methods=['GET'])
def all_currency_codes():
    
    return jsonify({'All Currency Codes': ""})

#endpoint to get currency conversion between two currencies by from_code, to_code and amount
@currency_api.route('/conversion/<string:from_code>/<string:to_code>/<int:ammount>', methods=['POST'])
def currency_conversion(from_code, to_code, ammount):
    return jsonify({'Value Converted': ""})

#endpoint to save currency code
@currency_api.route('/conversion/<string:currency_code>', methods=['POST'])
def add_currency(from_code, to_code, ammount):

    return jsonify({'Currency Codes': ""})

#endpoint to delete currency code
@currency_api.route('/conversion/<string:currency_code>', methods=['DELETE'])
def delete_currency(id):

    return jsonify({'Currency Codes': ""})
