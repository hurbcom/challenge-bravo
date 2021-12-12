from integrations.api_conversion import apiIntergration, dbIntegrations,apiCurrencyConversion, dbCurrencyConversion
from integrations import settings

def interfaceConversions(db, currencyfrom, currencyto, valueAmount):
    api = apiIntergration()
    response = api.make_request(endpoint='json/available')
    check = False
    
    for item in response:
        if item == f'{currencyfrom}-{currencyto}':
            check = True
    
    if check:
        api_conversion = apiCurrencyConversion(currencyfrom,currencyto)
        data = api_conversion.executeConversion()
        
        settings.CONVERSION["currency_conversion"] = f'{currencyfrom}-{currencyto}'
        settings.CONVERSION["value_amount"] = valueAmount
        settings.CONVERSION["values"]["for_buy"] = round(api_conversion.calculate(amount=valueAmount,tx_conversion=data['bid']),2)
        settings.CONVERSION["values"]["for_send"] = round(api_conversion.calculate(amount=valueAmount,tx_conversion=data['ask']),2)
        settings.CONVERSION["last_update"] = data['create_date']
        
        return settings.CONVERSION
    
    else:
        db_conversion = dbCurrencyConversion(db,currencyfrom,currencyto)
        data = db_conversion.executeConversion()
        
        settings.CONVERSION["currency_conversion"] = f'{currencyfrom}-{currencyto}'
        settings.CONVERSION["value_amount"] = valueAmount
        settings.CONVERSION["values"]["for_buy"] = round(db_conversion.calculate(amount=valueAmount,tx_conversion=data['buy']),2)
        settings.CONVERSION["values"]["for_send"] = round(db_conversion.calculate(amount=valueAmount,tx_conversion=data['send']),2)
        settings.CONVERSION["last_update"] = data['last_update']
        
        return settings.CONVERSION

def checkCurrencysAvailable(db):
    dbcheck = dbIntegrations(db).dbCurrencyAvailable()
    apicheck = apiIntergration().checkApiCurrencys()
    response = {
        "default_currency_conversions": apicheck,
        "fictitious_currencys_conversions": dbcheck["fictitious"],
        "fiat_currencys_conversions": dbcheck["fiat"],
        "others": dbcheck["others"]
    }
    
    return response