from typing import Dict
from tortoise.contrib.pydantic.creator import (
    pydantic_model_creator,
)
from models import CustomCurrency
from pydantic import BaseModel

custom_currency_pydantic = pydantic_model_creator(
    CustomCurrency, name="CustomCurrency"
)

custom_currency_pydantic_create = pydantic_model_creator(
    CustomCurrency,
    name="CustomCurrencyCreate",
    exclude=("id", "created_at", "updated_at"),
)
custom_currency_pydantic_upd = pydantic_model_creator(
    CustomCurrency,
    name="CustomCurrencyUpdate",
    exclude=("id", "created_at", "updated_at"),
)


class ExternalExchangeDataSchema(BaseModel):
    code: str
    codein: str
    name: str
    high: str
    low: str
    varBid: str
    pctChange: str
    bid: str
    ask: str
    timestamp: str
    create_date: str


class ExternalExchangeSchema(BaseModel):
    data: Dict[str, ExternalExchangeDataSchema]


class ExchangedCurrencySchema(BaseModel):
    from_currency: str
    to_currency: str
    name: str
    value: str
