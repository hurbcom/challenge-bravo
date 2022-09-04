from pydantic import BaseModel



class Favorite(BaseModel):
    currency_code: str
    currency_type: str