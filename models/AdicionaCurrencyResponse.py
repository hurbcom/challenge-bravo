from pydantic import BaseModel, Field


class AdicionaCurrencyResponse(BaseModel):
    name: str = Field(..., example="USD")
    success: bool = Field(..., example=True)
