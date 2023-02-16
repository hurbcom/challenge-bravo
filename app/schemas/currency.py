from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, validator


class Currency(BaseModel):
    currency_code: str
    rate: float
    backed_by: str = "USD"
    currency_type: str = "fictitious"

    @validator("currency_code")
    def uppercase_currency_code(cls, currency_code: str):
        return currency_code.upper()

    @validator("backed_by")
    def uppercase_backed_by(cls, backed_by: str):
        return backed_by.upper()


class CurrencyInput(Currency):
    rate: Optional[float]
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class CurrencyDatabase(BaseModel):
    id: int
    currency_code: str
    rate: float
    backed_by: str
    updated_at: datetime
    currency_type: str

    class Config:
        orm_mode = True


class CurrencyOut(BaseModel):
    id: int
    currency_code: str
    rate: float
    backed_by: str
    updated_at: datetime
    currency_type: str


class CurrencyResponse(BaseModel):
    data: CurrencyOut


class MultipleCurrencyResponse(BaseModel):
    data: List[CurrencyOut]
