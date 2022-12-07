from typing import Optional

from pydantic import BaseModel


class Currency(BaseModel):

    currency_code: str
    rate: float
    backed_by: str = "USD"
    currency_type: Optional[str]