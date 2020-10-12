from marshmallow import Schema, fields
from main.model import ObjectIdr

class Rate(Schema):
    _id = ObjectIdr(required=False)
    class Meta:
        fields = ("_id", "rate", "currency", "time", "engine")

