import re

from marshmallow import Schema, fields, validate


class ConversionSchema(Schema):
    REQUIRED_ERROR_MESSAGE = "Missing param."

    from_curr = fields.Str(
        required=True,
        data_key="from",
        attribute="from",
        error_messages={"required": REQUIRED_ERROR_MESSAGE},
    )
    to_curr = fields.Str(
        required=True,
        data_key="to",
        attribute="to",
        error_messages={"required": REQUIRED_ERROR_MESSAGE},
    )
    amount = fields.Decimal(
        required=True,
        places=4,
        error_messages={"required": REQUIRED_ERROR_MESSAGE},
    )
