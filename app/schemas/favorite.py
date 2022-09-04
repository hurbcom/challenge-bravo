from pydantic import BaseModel



class Favorite(BaseModel):
    currency_code: str
    currency_type: str


class FavoriteDatabase(BaseModel):
    id: int
    currency_code: str
    currency_type: str

    class Config:
        orm_mode = True