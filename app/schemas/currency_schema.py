import re

from marshmallow import Schema, fields, validate

validate.And


class NestedConversionSchema(Schema):
    USD = fields.Float(required=True)
    local = fields.Float(required=True)


class CurrencySchema(Schema):
    EMPTY_STR_ERROR_MSG = "Could not be an empty string."

    code = fields.Str(
        required=True, validate=validate.Length(1, error=EMPTY_STR_ERROR_MSG)
    )
    label = fields.Str(
        required=True, validate=validate.Length(1, error=EMPTY_STR_ERROR_MSG)
    )
    is_crypto = fields.Boolean(load_default=False)
    conversion = fields.Nested(NestedConversionSchema, required=True)
