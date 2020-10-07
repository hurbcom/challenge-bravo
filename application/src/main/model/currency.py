from marshmallow import Schema
from main.model import ObjectIdr

class Currency(Schema):
    _id = ObjectIdr()
    class Meta:
        fields = ("_id", "currency", "name")