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


class ExternalCurrencySchema(BaseModel):
    pass
