from dataclasses import dataclass
from schema import Schema, Use, And, SchemaError
from challenge_bravo.interfaces.domain import Domain
from datetime import datetime


@dataclass
class ExchangeRateResponse(Domain):
    success: str
    rate: float
    result: float
    date: datetime
    origin_currency: str
    destiny_currency: str
    amount: float

    @staticmethod
    def is_datetime_valid(date):
        try:
            datetime.strptime(date, '%Y-%m-%d')
            return True
        except ValueError:
            return False

    @property
    def validation_schema(self, *args, **kwargs):
        return Schema({
            "success": Use(bool),
            "rate": Use(float),
            "result": Use(float),
            "date": And(lambda x: self.is_datetime_valid(x)),
            "origin_currency": Use(str),
            "destiny_currency": Use(str),
            "amount": Use(float)
        })

    def validate(self, *args, **kwargs):
        try:
            item = self.validation_schema.validate(self.to_item())
            return ExchangeRateResponse(**item)
        except SchemaError:
            raise SchemaError('Error while validating data')

    def to_item(self, *args, **kwargs):
        return {
            "success": self.success,
            "rate": self.rate,
            "result": self.result,
            "date": self.date,
            "origin_currency": self.origin_currency,
            "destiny_currency": self.destiny_currency,
            "amount": self.amount
        }
