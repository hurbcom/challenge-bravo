from flask import request
from flask_restplus import Resource
import simplejson as json

from src.application.api.conversion.parsers import conversionRequest
from src.application.api.restplus import api
from src.application import settings

from src.domain.model.currency.conversion import Conversion

from src.integrations.currencyconversion.currencyprovider import getCurrencyProvider
from src.integrations.integrationexception import IntegrationException

ns = api.namespace('currency', description='Conversion endpoint')

@ns.route('/convert')
class ConversionResource(Resource):

    currencyProvider = getCurrencyProvider()

    # TODO: Response model
    @api.expect(conversionRequest)
    @api.response(200, '<success model here>') # TODO: OK response model
    @api.response(400, '<badrequest model here>') # TODO: BR response model
    def get(self):
        '''
        Gets an instant conversion based on the configured currencyProvider
        '''
        # Inserts the current available currencies into the schemaValidation
        requestArgs = {'validCurrencies': ConversionResource.currencyProvider.validCurrencies}
        requestArgs.update(request.args) 

        # Validation
        errors = Conversion.is_valid(requestArgs, ConversionResource.currencyProvider.validCurrencies)

        if errors:
            return {
                'success': False,
                'errors': errors
            }, 400

        # Conversion
        try:
            conversionResult = ConversionResource.currencyProvider.convert(request.args)
            return {
                    'success': True,
                    'data': {
                        'amount': json.dumps(conversionResult)
                    }
                }, 200

        except IntegrationException as integrException:
            return {
                'success': False,
                'errors': str(integrException)
            }, 500    

