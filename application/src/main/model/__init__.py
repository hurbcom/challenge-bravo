import bson
import json
from bson import ObjectId
from marshmallow import ValidationError, fields, missing, Schema

class ObjectIdr(fields.Field):
    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
            sort_keys=True, indent=4)
    def _deserialize(self, value, attr, data, partial):
        try:
            return bson.ObjectId(value).__str__()
        except Exception:
            raise ValidationError("invalid ObjectId `%s`" % value)

    def _serialize(self, value, attr, obj):
        if value is None:
            return missing
        return str(value)