import re
from datetime import datetime
from locale import currency
from uuid import uuid4

from app.classes.app_with_db import AppWithDb
from app.models.cotations_model import Cotation
from app.models.currencies_model import Currency


def test_cotation_model_fields(colorized):
    """
    GIVEN the Cotation model
    WHEN I instanciate with right payload data
    THEN the attributes are setted correctly
    """

    data = {
        "id": uuid4(),
        "code": "USD-BRL",
        "rate": 5.23,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "from_currency_id": uuid4(),
        "to_currency_id": uuid4(),
    }

    cotation = Cotation(**data)

    for key, value in data.items():
        assert hasattr(cotation, key), colorized(
            f"{key} not present in Cotation instance"
        )
        assert getattr(cotation, key) == value, colorized(
            f"{key} does not have expected value in Cotation instance"
        )


def test_cotation_model_tablename():
    """
    GIVEN the Cotation model
    WHEN I verify the table name setted
    THEN it is 'cotations'
    """

    assert Cotation.__tablename__ == "cotations"


def test_cotation_default_fields(app: AppWithDb, colorized):
    """
    GIVEN the Cotation model
    WHEN I instanciate just with required payload data
    WHEN I insert it into database
    THEN the defaulted attributes must have been setted correctly
    """

    default_fields = (
        ("id", str),
        ("created_at", datetime),
        ("updated_at", datetime),
    )

    with app.app_context():
        session = app.db.session

        data = {
            "code": "USD-BRL",
            "rate": 5.23,
        }

        cotation = Cotation(**data)

        session.add(cotation)
        session.commit()

        for attr, value_type in default_fields:
            value = getattr(cotation, attr)

            assert type(value) == value_type, colorized(
                f"{attr} type is not the expected {value_type} in Cotation instance"
            )

        pattern = (
            r"^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
        )
        assert re.match(pattern, cotation.id)


def test_cotation_relation_fields(
    app: AppWithDb,
    colorized,
    get_currency_data,
):
    """
    GIVEN the Cotation model relationships
    WHEN I instanciate Cotation passing related objects
    WHEN I insert it into database
    THEN the related attributes must be setted
    """

    related_attributes = (
        ("from_currency", Currency),
        ("to_currency", Currency),
    )

    with app.app_context():
        session = app.db.session

        currencies = {
            "from_currency": Currency(**get_currency_data()),
            "to_currency": Currency(**get_currency_data()),
        }

        data = {
            "code": "USD-BRL",
            "rate": 5.23,
            "from_currency": currencies["from_currency"],
            "to_currency": currencies["to_currency"],
        }

        cotation = Cotation(**data)

        session.add(cotation)
        session.commit()

        for attr, value_type in related_attributes:
            currency: Currency = getattr(cotation, attr)

            assert isinstance(currency, value_type), colorized(
                f"{attr} type is not the expected {value_type} in Cotation instance"
            )

            assert currency.id == currencies[attr].id


def test_cotation_field_types(
    app: AppWithDb,
    colorized,
    get_currency_data,
    get_cotation_data,
):
    """
    GIVEN the Cotation model
    WHEN I instanciate correcty
    WHEN I insert it into database
    THEN the attributes types must have be same as expected
    """

    fields = (
        ("id", str),
        ("code", str),
        ("rate", float),
        ("created_at", datetime),
        ("updated_at", datetime),
        ("from_currency_id", str),
        ("to_currency_id", str),
        ("from_currency", Currency),
        ("to_currency", Currency),
    )

    with app.app_context():
        session = app.db.session

        from_currency = Currency(**get_currency_data())
        to_currency = Currency(**get_currency_data())

        data = {
            **get_cotation_data(from_currency, to_currency),
            "from_currency": from_currency,
            "to_currency": to_currency,
        }

        cotation = Cotation(**data)

        session.add(cotation)
        session.commit()

        for attr, value_type in fields:
            value = getattr(cotation, attr)

            assert type(value) == value_type, colorized(
                f"{attr} type is not the expected {value_type} in Cotation instance"
            )
