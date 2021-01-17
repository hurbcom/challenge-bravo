CreateCurrencySchema = {
    "name": {"type": "string", "maxlength": 200, "required": True},
    "isoCode": {"type": "string", "minlength": 3, "maxlength": 3, "required": True},
    "standard": {"type": "boolean"},
}

UpdateCurrencySchema = {
    "name": {"type": "string", "maxlength": 200},
    "isoCode": {"type": "string", "minlength": 3, "maxlength": 3},
    "standard": {"type": "boolean"},
}

GetCurrencyConversionSchema = {
    "from": {"type": "string", "minlength": 3, "maxlength": 3, "required": True},
    "to": {"type": "string", "minlength": 3, "maxlength": 3, "required": True},
    "amount": {"type": "float", "min": 0, "coerce": float, "required": True},
}
