from flask import request
from flask_restplus import Resource
import simplejson as json

from src.application.api.conversion.parsers import conversionRequest
from src.application.api.conversion.models.currencyModels import successModel, badRequestModel, internalErrorModel
from src.application.api.restplus import api
from src.application import settings

from src.domain.model.currency.conversion import Conversion

from src.integrations.currencyconversion.currencyprovider import getCurrencyProvider
from src.integrations.integrationexception import IntegrationException

ns = api.namespace('currency', description='Conversion endpoint')

@ns.route('/convert')
class ConversionResource(Resource):

    currencyProvider = getCurrencyProvider()

    @api.expect(conversionRequest)
    @api.response(200, 'Success', successModel)
    @api.response(400, 'Bad Request', badRequestModel)
    @api.response(500, 'Internal Server Error', internalErrorModel)
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

