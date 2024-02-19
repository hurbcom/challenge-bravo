from fastapi import FastAPI

from services.awesome_api import AwesomeApiService

app = FastAPI()

@app.get("/convert")
def read_root(from_currency: str, to_currency:str, amount: float):
    awesome_api_service = AwesomeApiService()
    bid_value = awesome_api_service.get_bid_value_from_api(from_currency=from_currency, to_currency=to_currency)
    output = {
        "bid_value": bid_value,

              }
    return output