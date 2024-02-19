import json
from fastapi import FastAPI
from inputs import Currency

from services.awesome_api import AwesomeApiService
from services.redis import Redis

app = FastAPI()

@app.get("/convert")
def convert(from_currency: str, to_currency:str, amount: float):
    awesome_api_service = AwesomeApiService()
    bid_value = awesome_api_service.get_bid_value_from_api(from_currency=from_currency, to_currency=to_currency)
    converted_value = float(bid_value) * amount
    output = {
        "bid_value": bid_value,
        "converted_value": converted_value,
        }
    return output

@app.post("/currency")
def create_currency(request: Currency):
    payload = json.loads(request.json())
    redis_service = Redis()
    response = redis_service.add_currency(payload)
    return response