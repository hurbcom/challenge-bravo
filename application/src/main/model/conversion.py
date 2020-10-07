from marshmallow import Schema, fields
from main.model import ObjectIdr

class Conversion(Schema):
    from_currency = fields.String()
    from_value = fields.Float()
    to_currency = fields.String()
    to_value = fields.Float(required=False)
    class Meta:
        fields = ("from_currency", "from_value","to_currency", "to_value")