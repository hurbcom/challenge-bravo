from pydantic import BaseModel
from typing import Optional

class Login(BaseModel):
    username: str
    password: str

class User(BaseModel):
    username: str
    name: str
    password: str
    
    class Config:
        orm_mode = True
        
class Currencys(BaseModel):
    currency: str
    name: str
    for_buy: float
    for_send: float
    currency_type: str
    
    class Config:
        orm_mode = True

