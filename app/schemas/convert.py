from pydantic import BaseModel, validator
from datetime import datetime



class ConversionInput(BaseModel):
    source: str
    target: str
    amount: float

    @validator("source")
    def uppercase_source(cls, source: str):
        return source.upper()

    @validator("target")
    def uppercase_target(cls, target: str):
        return target.upper()


class ConversionOut(ConversionInput):

    converted_amount: float
    updated_at: datetime


class ConversionResponse(BaseModel):
    data: ConversionOut