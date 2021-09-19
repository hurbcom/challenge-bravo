from pydantic import BaseModel, Field


class ConversionResponse(BaseModel):
    orig: str = Field(..., example="USD")
    dest: str = Field(..., example="BRL")
    orig_value: float = Field(..., example="1.00")
    converted_value: float = Field(..., example="5.50")
