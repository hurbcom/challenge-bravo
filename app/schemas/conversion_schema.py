import re

from marshmallow import Schema, fields, validate


class ConversionSchema(Schema):
    REGEX_ALPHA_PATTERN = r"^[a-z]+$"
    REGEX_ERROR_MESSAGE = "Value must be alphabetical."

    from_curr = fields.Str(
        validate=validate.Regexp(
            REGEX_ALPHA_PATTERN,
            flags=re.IGNORECASE,
            error=REGEX_ERROR_MESSAGE,
        ),
        required=True,
        data_key="from",
        attribute="from",
    )
    to_curr = fields.Str(
        validate=validate.Regexp(
            REGEX_ALPHA_PATTERN,
            flags=re.IGNORECASE,
            error=REGEX_ERROR_MESSAGE,
        ),
        required=True,
        data_key="to",
        attribute="to",
    )
    amount = fields.Decimal(required=True, places=4)
