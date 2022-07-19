import re

from marshmallow import Schema, fields, validate


class ConversionSchema(Schema):
    from_curr = fields.Str(
        validate=validate.Regexp(r"[a-z]+", flags=re.IGNORECASE),
        required=True,
        data_key="from",
        attribute="from",
    )
    to_curr = fields.Str(
        validate=validate.Regexp(r"[a-z]+", flags=re.IGNORECASE),
        required=True,
        data_key="to",
        attribute="to",
    )
    amount = fields.Decimal(required=True, places=4)
