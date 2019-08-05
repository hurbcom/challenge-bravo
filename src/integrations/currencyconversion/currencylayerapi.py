import currencylayer
from decimal import Decimal

from src.contracts.currencyconversion.currencyconversionapi import CurrencyConversionApi
from src.integrations.httpclient import httpsGet
from src.integrations.integrationexception import IntegrationException

# Example class
class CurrencyLayerApi(metaclass=CurrencyConversionApi):
    baseUrl = 'apilayer.net/api'

    # Or obtained directly from currencylayer
    validCurrencies = [
        'AED','AFN','ALL','AMD','ANG','AOA','ARS','AUD','AWG','AZN',
        'BAM','BBD','BDT','BGN','BHD','BIF','BMD','BND','BOB','BRL','BSD','BTC','BTN','BWP','BYR','BZD',
        'CAD','CDF','CHF','CLF','CLP','CNY','COP','CRC','CUC','CUP','CVE','CZK',
        'DJF','DKK','DOP','DZD',
        'EGP','ERN','ETB','EUR',
        'FJD','FKP','GBP','GEL','GGP','GHS','GIP','GMD','GNF','GTQ','GYD',
        'HKD','HNL','HRK','HTG','HUF',
        'IDR','ILS','IMP','INR','IQD','IRR','ISK',
        'JEP','JMD','JOD','JPY',
        'KES','KGS','KHR','KMF','KPW','KRW','KWD','KYD','KZT',
        'LAK','LBP','LKR','LRD','LSL','LTL','LVL','LYD',
        'MAD','MDL','MGA','MKD','MMK','MNT','MOP','MRO','MUR','MVR','MWK','MXN','MYR','MZN',
        'NAD','NGN','NIO','NOK','NPR','NZD',
        'OMR',
        'PAB','PEN','PGK','PHP','PKR','PLN','PYG',
        'QAR',
        'RON','RSD','RUB','RWF',
        'SAR','SBD','SCR','SDG','SEK','SGD','SHP','SLL','SOS','SRD','STD','SVC','SYP','SZL',
        'THB','TJS','TMT','TND','TOP','TRY','TTD','TWD','TZS',
        'UAH','UGX','USD','UYU','UZS',
        'VEF','VND','VUV',
        'WST',
        'XAF','XAG','XAU','XCD','XDR','XOF','XPF',
        'YER','ZAR',
        'ZMK','ZMW','ZWL']

    def __init__(self, apiKey):
        self.apiKey = apiKey

    def convert(self, conversionRequest):
        exchange_rate = currencylayer.Client(access_key=self.apiKey)

        from_ = conversionRequest['from']
        to = conversionRequest['to']
        amount = conversionRequest['amount']

        # HERE, we can't directly convert using a free subscription because the 'from' parameter MUST be 'USD'.
        # So a simple alternative is to use some algebra in case from_ is not 'USD' ;)
        # On the other hand, when 'to' is USD, we need only to revert the opperand
        try:
            response = exchange_rate.live_rates_for([to, from_], 'USD')

            if response['success']:
                quotes = response['quotes']

                returnAmount = None
                # Simple conversion
                if to == 'USD':
                    returnAmount = Decimal(amount) / Decimal(quotes[to + from_])

                elif from_ == 'USD':
                    returnAmount = Decimal(amount) * Decimal(quotes[from_ + to])

                # Algebra
                else:
                    fromQuote = quotes['USD' + from_]
                    toQuote = quotes['USD' + to]

                    returnAmount = Decimal(amount) * (Decimal(toQuote) / Decimal(fromQuote))

                # TODO: extract to helper function
                SIXPLACES = Decimal(10) ** -6
                return returnAmount.quantize(SIXPLACES)

            else:
                responseError = response['error']
                errorMsg = 'Error ({}) - {}'.format(responseError['code'], responseError['info'])
                raise IntegrationException(errorMsg)

        except Exception as ex:
            # Save inner exception for more detailed info
            raise IntegrationException(str(ex)) from ex
