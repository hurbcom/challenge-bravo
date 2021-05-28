import peewee

from pydantic import BaseModel 

from .settings import db_instance


class Coin(BaseModel):
    """ Coin type """
    name: str
    code: str
    price: float
    base: str = 'USD'


class CoinModel(peewee.Model):
    """ Coin database model """
    name = peewee.CharField()
    code = peewee.CharField()
    price = peewee.FloatField()
    base = peewee.CharField(default='USD')

    def convert(self, to, amount):
        if self.code == self.base:
            return amount
        coin_to = self
        return (amount * self.price) / to.price


    class Meta:
        database = db_instance
