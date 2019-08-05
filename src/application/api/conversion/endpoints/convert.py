from flask import request
from flask_restplus import Resource
import simplejson as json

from src.application.api.conversion.parsers import conversionRequest

from src.domain.model.currency.conversion import Conversion
from src.application.api.restplus import api

from src.integrations.currencyconversion.currencyconversionmockapi import CurrencyConversionMockApi
from src.integrations.currencyconversion.currencylayerapi import CurrencyLayerApi
from src.integrations.integrationexception import IntegrationException

from src.application import settings

ns = api.namespace('currency', description='Conversion endpoint')

# Integrations
currencyIntegrationApi = None
# TODO: envvar
MockCurrencyConversionApi = True

if MockCurrencyConversionApi:
    currencyIntegrationApi = CurrencyConversionMockApi()
else:
    currencyIntegrationApi = CurrencyLayerApi(settings.CURRENCY_LAYER_API_KEY)
assert not currencyIntegrationApi is None, 'currencyIntegrationApi can''t be None!'

@ns.route('/convert')
class ConversionResource(Resource):

    # TODO: Response model
    @api.expect(conversionRequest)
    @api.response(200, '<success model here>') # TODO: OK response model
    @api.response(400, '<badrequest model here>') # TODO: BR response model
    def get(self):
        '''
        Gets an instant conversion based on the configured currencyProvider
        '''
        # Inserts the current available currencies into the schemaValidation
        requestArgs = {'validCurrencies': currencyIntegrationApi.validCurrencies}
        requestArgs.update(request.args) 

        # Validation
        errors = Conversion.is_valid(requestArgs, currencyIntegrationApi.validCurrencies)

        if errors:
            return {
                'success': False,
                'errors': errors
            }, 400

        # Conversion
        try:
            conversionResult = currencyIntegrationApi.convert(request.args)
            return {
                    'success': True,
                    'data': {
                        'amount': json.dumps(conversionResult)
                    }
                }, 200

        except IntegrationException as integrationException:
            return {
                'success': False,
                'errors': str(integrationException)
            }, 500    

