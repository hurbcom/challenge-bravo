from pydantic import BaseModel


class Currency(BaseModel):
    code: str
    rate: float
