from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, validator, Field, root_validator


class Currency(BaseModel):
    currency_code: str
    rate: float
    backed_by: str = "USD"
    currency_type: Optional[str]

    @validator("currency_code")
    def uppercase_currency_code(cls, currency_code: str):
        return currency_code.upper()

    @validator("backed_by")
    def uppercase_backed_by(cls, backed_by: str):
        return backed_by.upper()

class CurrencyInput(Currency):
    rate: Optional[float]
    backed_by: str
    amount: Optional[float]
    backed_currency_amount: Optional[float]
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    currency_type: Optional[str]

    @root_validator(pre=True)
    def rate_and_amount(cls, values):
        if "rate" not in values and (
            "amount" not in values or "backed_currency_amount" not in values
        ):
            raise ValueError(
                "Needs provide rate field or an amount with backed_currency_amount"
            )
        elif "rate" in values and (
            "amount" in values or "backed_currency_amount" in values
        ):
            raise ValueError(
                "Needs provide only a rate field or amount with backed_currency_amount fields"
            )
        return values

    @root_validator(pre=True)
    def get_rate(cls, values):
        if "rate" in values:
            return values
        values["rate"] = values["amount"] / values["backed_currency_amount"]
        values["amount"] = None
        values["backed_currency_amount"] = None
        return values

class CurrencyDatabase(BaseModel):
    id: int
    currency_code: str
    rate: float
    backed_by: str
    updated_at: datetime
    currency_type: str

    class Config:
        orm_mode = True


class CurrencyOutput(BaseModel):
    currency_code: str
    rate: float
    backed_by: str
    updated_at: datetime
    currency_type: str


class CurrencyResponse(BaseModel):
    data: CurrencyOutput


class MultipleCurrencyResponse(BaseModel):
    data: List[CurrencyOutput]