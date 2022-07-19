from app.errors.invalid_value_types_error import InvalidValueTypesError
from app.utils import isfloat


def verify_types(**field_map: dict) -> None:
    """
    Verifies if fields has informed types.

    `field_map` - a dictionary containing raw data received in request.

    Example::

        {
            "from": "USD",
            "to": "BRL",
            "amount": "1",
        }
    """

    validators = {
        "from": str.isalpha,
        "to": str.isalpha,
        "amount": isfloat,
    }

    expected_types = {
        "from": "alphabetical",
        "to": "alphabetical",
        "amount": "floatable",
    }

    field = {
        "from": {"validate": str.isalpha, "type": "alphabetical"},
        "to": {"validate": str.isalpha, "type": "alphabetical"},
        "amount": {"validate": isfloat, "type": "floatable"},
    }

    check_types = [validators[field](value) for field, value in field_map.items()]

    if not all(check_types):
        invalid_types = {
            field: {"expected": expected_types[field], "received": value}
            for field, value in field_map.items()
            if not validators[field](value)
        }

        msg = {"error_msg": "Invalid value types.", "extra_fields": invalid_types}
        raise InvalidValueTypesError(**msg)
