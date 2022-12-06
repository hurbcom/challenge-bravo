from typing import List, Optional

from pydantic import BaseModel, validator


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
