from src.application import settings

from src.integrations.currencyconversion.currencyconversionmockapi import CurrencyConversionMockApi
from src.integrations.currencyconversion.currencylayerapi import CurrencyLayerApi

def getCurrencyProvider():
    ''' Returns a concrete instance of CurrencyConversionApi
    '''
    currencyIntegrationApi = None
    
    MockCurrencyConversionApi = settings.MOCK_CURRENCY_PROVIDER

    if MockCurrencyConversionApi:
        currencyIntegrationApi = CurrencyConversionMockApi()
    else:
        currencyIntegrationApi = CurrencyLayerApi(settings.CURRENCY_LAYER_API_KEY)
        
    return currencyIntegrationApi