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
