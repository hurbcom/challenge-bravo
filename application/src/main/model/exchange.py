from marshmallow import Schema, fields
from main.model import ObjectIdr

class ExchangeRate(Schema):
    _id = ObjectIdr(required=False)
    class Meta:
        fields = ("_id", "source_id", "currency", "value")

class ExchangeSource(Schema):
    _id = ObjectIdr(required=False)
    rates = fields.Dict(required=False)
    class Meta:
        fields = ("_id", "source", "base", "date", "time_last_updated","rates")


