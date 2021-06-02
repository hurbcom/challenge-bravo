import peewee

from pydantic import BaseModel
from pydantic import validator

from .settings import db_instance


class Coin(BaseModel):
    """ Coin type """

    coin_id: int = None
    name: str
    code: str
    price: float
    base: str = 'USD'

    @validator('base')
    def base_coin_is_usd(cls, value):
        if value != 'USD':
            raise ValueError('Base coin must be USD!')
        return value


class CoinModel(peewee.Model):
    """ Coin database model """

    name = peewee.CharField()
    code = peewee.CharField()
    price = peewee.FloatField()
    base = peewee.CharField(default='USD')

    def convert(self, to: Coin, amount: float) -> float:
        if self.code == to.code:
            return amount
        converted_value = (amount * self.price) / to.price
        return round(converted_value, 2)

    def get_as_coin_type(self) -> Coin:
        return Coin(
            coin_id=self.id, name=self.name, code=self.code, price=self.price)

    class Meta:
        database = db_instance
