from pydantic import BaseModel, Field


class RemoveCurrencyResponse(BaseModel):
    name: str = Field(..., example="USD")
    success: bool = Field(..., example=True)
