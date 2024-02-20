import json
from fastapi import FastAPI
from inputs import Currency

from services.awesome_api import AwesomeApiService
from services.redis import Redis
from services.utils import is_currency_avaliable, is_currency_fictional, has_fictional_currency_flow, not_fictional_currency_flow

app = FastAPI()

@app.get("/convert")
def convert(from_currency: str, to_currency:str, amount: float):
    if not is_currency_avaliable(from_currency) or not is_currency_avaliable(to_currency):
        return {"message": "Moedas não disponíveis, por favor insira no banco de dados"}, 404
    if is_currency_fictional(from_currency) or is_currency_fictional(to_currency):
        output = has_fictional_currency_flow(from_currency=from_currency, to_currency=to_currency, amount=amount)
    else:
        output = not_fictional_currency_flow(from_currency=from_currency, to_currency=to_currency, amount=amount)
        
    
    return output, 200

@app.post("/currency")
def create_currency(request: Currency):

    payload = json.loads(request.json())
    redis_service = Redis()
    response = redis_service.add_currency(payload)
    return response, 200