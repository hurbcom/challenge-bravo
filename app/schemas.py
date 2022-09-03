from pydantic import BaseModel, validator
from typing import Optional



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