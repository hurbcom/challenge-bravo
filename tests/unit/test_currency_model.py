from datetime import datetime

from app.classes.app_with_db import AppWithDb
from app.models.currencies_model import Currency


def test_currency_model_fields(colorized):
    """
    GIVEN the Currency model
    WHEN I instanciate with right payload data
    THEN the attributes are setted correctly
    """

    data = {
        "id": 1,
        "code": "BRL",
        "label": "Real Brasileiro",
        "backing_currency": False,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
    }

    currency = Currency(**data)

    for key, value in data.items():
        assert hasattr(currency, key), colorized(
            f"{key} not present in Currency instance"
        )
        assert getattr(currency, key) == value, colorized(
            f"{key} does not have expected value in Currency instance"
        )


def test_currency_model_tablename():
    """
    GIVEN the Currency model
    WHEN I verify the table name setted
    THEN it is 'currencies'
    """

    assert Currency.__tablename__ == "currencies"


def test_currency_default_fields(app: AppWithDb, colorized):
    """
    GIVEN the Currency model
    WHEN I instanciate just with required payload data
    WHEN I insert it into database
    THEN the defaulted attributes must have been setted correctly
    """

    data = {
        "code": "BRL",
        "label": "Real Brasileiro",
    }

    default_fields = (
        ("id", int),
        ("backing_currency", bool),
        ("created_at", datetime),
        ("updated_at", datetime),
    )

    with app.app_context():
        session = app.db.session

        currency = Currency(**data)

        session.add(currency)
        session.commit()

        for attr, value_type in default_fields:
            value = getattr(currency, attr)

            assert type(value) == value_type, colorized(
                f"{attr} type is not the expected {value_type} in Currency instance"
            )
