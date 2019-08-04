from flask import Flask, jsonify, request

from src.domain.model.currency.conversion import Conversion
from src.domain.model.currency.conversion import Conversion

from src.integrations.currencyconversion.currencyconversionmockapi import CurrencyConversionMockApi
from src.integrations.currencyconversion.currencylayerapi import CurrencyLayerApi

app = Flask(__name__)


# Integrations
currencyIntegrationApi = None
# TODO: envvar
MockCurrencyConversionApi = True

if MockCurrencyConversionApi:
    currencyIntegrationApi = CurrencyConversionMockApi()
else:
    currencyIntegrationApi = CurrencyLayerApi()
assert not currencyIntegrationApi is None, 'currencyIntegrationApi can''t be None!'


@app.route('/currency/convert', methods=['GET'])
def convert():
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
    