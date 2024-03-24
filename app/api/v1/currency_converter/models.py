from datetime import datetime
from random import randint
from uuid import uuid4

from pydantic import (
    BaseModel,
    field_validator,
)

from app.api.v1.currency_converter.exceptions import ValidateAcronymException

MIN_VALUE = 1
MAX_VALUE = 100
MAX_ACRONYM_VALUE = 5


def attached_value() -> float:
    """
    Caso o peso atrelado a moedas criadas não seja
    passado, vai ser gerado um valor randomicamente.
    """
    value = randint(MIN_VALUE, MAX_VALUE)
    return float(value)


def created_at() -> str:
    now = datetime.now()
    return now.strftime("%d/%m/%Y, %H:%M:%S")


class Currency(BaseModel):
    id: str | None = str(uuid4())
    acronym: str
    name: str
    created_at: str | None = created_at()
    dolar_price_reference: float | None = attached_value()

    @field_validator("acronym")
    def validate_name(cls, name: str) -> str:
        if len(name) > MAX_ACRONYM_VALUE:
            raise ValidateAcronymException
        return name.upper()


class DeleteCurrencyById(BaseModel):
    id: str = None


class DeleteCurrencyByAcronym(BaseModel):
    acronym: str
