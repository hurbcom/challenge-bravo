from services.awesome_api import AwesomeApiService
from services.redis import Redis
def is_currency_fictional(currency_name: str):
    currency = Redis().get_currency(currency_name=currency_name)
    return currency.get("is_fictional", "false") == "True"

def is_currency_avaliable (currency_name: str):
    avaliable_currencies = Redis().get_avaliable_currencies()

    return currency_name in avaliable_currencies

def has_fictional_currency_flow(from_currency: str, to_currency: str, amount: int):
    from_currency_backing,from_currency_backing_amount = _extract_backing_and_backing_amount(from_currency)
    to_currency_backing,to_currency_backing_amount = _extract_backing_and_backing_amount(to_currency)
    bid_value = _get_bid_value(from_currency=from_currency_backing, to_currency=to_currency_backing)
    converted_value = ((float(bid_value) * float(from_currency_backing_amount))/float(to_currency_backing_amount)) * amount
    output = _mount_output(float(bid_value), converted_value)
    return output

def not_fictional_currency_flow(from_currency: str, to_currency: str, amount: int):
    bid_value = _get_bid_value(from_currency,to_currency)
    converted_value = float(bid_value) * amount
    output = _mount_output(float(bid_value), converted_value)
    return output
    
def _get_bid_value(from_currency: str, to_currency: str):
    awesome_api_service = AwesomeApiService()
    bid_value = awesome_api_service.get_bid_value_from_api(from_currency=from_currency, to_currency=to_currency)
    return bid_value
     
def _extract_backing_and_backing_amount(currency_name):
    currency = Redis().get_currency(currency_name=currency_name)

    if not currency.get("is_fictional", "false") == "True":
            return currency_name,1
    
    return currency.get("backing"), currency.get("backing_amount")

def _mount_output(bid_value:float, converted_value: float):
     return {
        "bid_value": bid_value,
        "converted_value": converted_value,
        }
    



