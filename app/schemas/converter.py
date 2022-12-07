from datetime import datetime

from pydantic import BaseModel, validator

class InputConversionSchema(BaseModel):
    from_: str
    to: str
    amount: float

    @validator("from_")
    def do_uppercase_on_fromthis_field(cls, from_: str):
        return from_.upper()

    @validator("to")
    def do_uppercase_on_to_field(cls, to: str):
        return to.upper()


class OutputConversionSchema(InputConversionSchema):
    converted_value: float
    updated_at: datetime


class ConverterModelResponse(BaseModel):
    data: OutputConversionSchema