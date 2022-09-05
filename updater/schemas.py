from pydantic import BaseModel
from typing import Optional



class Currency(BaseModel):

    currency_code: str
    rate: float
    backed_by: str = "USD"
    currency_type: Optional[str]