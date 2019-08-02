from flask import Flask, jsonify, request

from domain.model.currency.conversion import Conversion
from domain.model.currency.conversion import Conversion

from integrations.currencyconversion.currencyconversionmockapi import CurrencyConversionMockApi
from integrations.currencyconversion.currencylayerapi import CurrencyLayerApi

app = Flask(__name__)


# Integrations
currencyIntegrationApi = None
# TODO: envvar
MockCurrencyConversionApi = False

if MockCurrencyConversionApi:
    currencyIntegrationApi = CurrencyConversionMockApi()
else:
    currencyIntegrationApi = CurrencyLayerApi()
assert not currencyIntegrationApi is None, 'currencyIntegrationApi can''t be None!'


@app.route('/currency/convert', methods=['GET'])
def convert():
    # Exception handling is decorated so any exception thrown during validation would result
    # in an automatic catch and be sent to user

    # Inserts the current available currencies into the schemaValidation
    requestArgs = {'validCurrencies': currencyIntegrationApi.validCurrencies}
    requestArgs.update(request.args) 

    # Validation
    
    errors = Conversion.is_valid(requestArgs, currencyIntegrationApi.validCurrencies)

    if errors:
        return {
            'success':False,
            'errors': errors
        }, 400

    return {
            'success':True,
            'data': {}
        }, 200

if __name__ == "__main__":
    app.run()
    