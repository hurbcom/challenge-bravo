#--- Setting endpoints for api ---#

from flask import Blueprint, jsonify, make_response, abort

#import modules 
from src.schemas.currency import CurrencySchema
from src.business.currency import CurrencyBusiness
from src.service.currency_conversion import Currency_Conversion

#define the blueprint name
currency_api = Blueprint(name="currency_api", import_name=__name__)

#define schemas 
currency_schema = CurrencySchema()
currencies_schema = CurrencySchema(many=True)

#endpoint to get all available currency codes
@currency_api.route('/conversion', methods=['GET'])
def all_currency_codes():
    """
    ---
    get:
      tags:
        - currency conversion
      summary: Get all currencies code
      description: ""
      parameters: []
      responses:
        '200':
          description: Call Successfuly

    """
    get_currencies = CurrencyBusiness.get_all_currencies()
    return jsonify({'All Currency Codes': currencies_schema.dump(get_currencies)})

#endpoint to get currency conversion between two currencies by from_code, to_code and amount
@currency_api.route('/conversion/<string:from_code>/<string:to_code>/<int:ammount>', methods=['POST'])
def currency_conversion(from_code, to_code, ammount):
    
    """
    ---
    post:
      tags:
          - currency conversion
      summary: Calculate the currency conversion
      description: ""
      parameters: 
        - name: from_code
          required: true
          in: path
          description: representes a currency codes
          type: string
          format: string

        - name: to_code
          required: true
          in: path
          description: representes a currency codes
          type: string
          format: string

        - name: ammount
          required: true
          in: path
          description: representes a currency codes
          type: float
          format: float

      responses:
        '200':
          description: Value Converted Successfully
    
    """

    response = Currency_Conversion.calculate_conversion(from_code, to_code, ammount)
    return jsonify(response), response["status"]

#endpoint to save currency code
@currency_api.route('/conversion/<string:currency_code>', methods=['POST'])
def add_currency(currency_code):
     
    """
    ---
    post:
      tags:
          - currency conversion
      summary: Add new currency code
      description: ""
      parameters: 
        - name: currency_code
          required: true
          in: path
          description: representes a currency codes
          type: string
          format: string
      responses:
        '201':
          description: Currency Code register successfully
    
    """

    response = CurrencyBusiness.insert_currency(currency_code) 
    return jsonify(response), response["status"]

#endpoint to delete currency code
@currency_api.route('/conversion/<int:id>', methods=['DELETE'])
def delete_currency(id):

    """
    ---
    delete:
      tags:
          - currency conversion
      summary: Delete currency code
      description: ""
      parameters: 
        - name: id
          required: true
          in: path
          description: represents id of currency code
          type: int
          format: int
      responses:
        '200':
          description: Currency Code remove successfully
    
    """

    response = CurrencyBusiness.delete_currency(id)
    return jsonify(response), response["status"]

# @currency_api.before_app_first_request
# def inital_values():
#   CurrencyBusiness.insert_currency("USD")
#   CurrencyBusiness.insert_currency("BRL")
#   CurrencyBusiness.insert_currency("EUR")
#   CurrencyBusiness.insert_currency("BTC")
#   CurrencyBusiness.insert_currency("ETH")