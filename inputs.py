from pydantic import BaseModel
from typing import Optional

class Currency(BaseModel):
    currency_name: str
    is_fictional: Optional[bool]
    backing: Optional[str]
    backing_amount: Optional[float]
