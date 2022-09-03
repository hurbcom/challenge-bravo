from pydantic import BaseModel, validator, root_validator, Field
from typing import Optional
from datetime import datetime



class Currency(BaseModel):
    currency_code: str
    rate: float
    backed_by: str = "USD"
    currency_type: Optional[str]

    @validator("currency_code")
    def uppercase_currency_code(cls, currency_code: str):
        """ force currency code to uppercase """
        return currency_code.upper()

    @validator("backed_by")
    def uppercase_backed_by(cls, backed_by: str):
        """ force backed currency code to uppercase """
        return backed_by.upper()


class CurrencyInput(Currency):
    rate: Optional[float]
    backed_by: str
    amount: Optional[float]
    backed_currency_amount: Optional[float]
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    currency_type: Optional[str]

    @root_validator(pre=True)
    def check_rate_or_amount(cls, values):
        """ Checks if either `rate` value or (`amount` and `backed_currency_amount`) are provided """
        if "rate" not in values and ("amount" not in values or "backed_currency_amount" not in values):
            raise ValueError("You should provide whether a rate field or an amount and backed_currency_amount fields")
        elif "rate" in values and ("amount" in values or "backed_currency_amount" in values):
            raise ValueError("You should provide only a rate field or an amount and backed_currency_amount fields")
        return values

    @root_validator(pre=True)
    def get_rate_from_input(cls, values):
        """ Calculates the `rate` field"""
        if "rate" in values:
            return values
        values['rate'] = values['amount'] / values['backed_currency_amount']
        values['amount'] = None
        values['backed_currency_amount'] = None
        return values


class CurrencyDatabase(BaseModel):
    id: int
    currency_code: str
    rate: float
    backed_by: str
    updated_at: datetime
    currency_type: str