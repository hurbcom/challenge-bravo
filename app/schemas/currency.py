from typing import Optional
from pydantic import BaseModel


class CurrencyBase(BaseModel):
    code: Optional[str]
    rate: Optional[float]


class CurrencyCreate(CurrencyBase):
    code: str
    rate: float


class CurrencyUpdate(CurrencyBase):
    pass


class CurrencyInDB(CurrencyBase):
    code: str
    rate: float

    class Config:
        orm_mode = True


class Currency(CurrencyInDB):
    pass
