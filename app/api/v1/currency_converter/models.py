from random import randint

from pydantic import (
    BaseModel,
    field_validator,
)

MIN_VALUE = 1
MAX_VALUE = 10000


class NewCurrency(BaseModel):
    name: str

    @field_validator("name")
    def validate_name(cls, name: str) -> str:
        return name.upper()

    @property
    def attached_value(self) -> str:
        value = randint(MIN_VALUE, MAX_VALUE)
        return float(value)


class DeleteCurrency(BaseModel):
    name: str = None
    id: str = None
