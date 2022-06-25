import re
from datetime import datetime
from uuid import uuid4

from app.classes.app_with_db import AppWithDb
from app.models.cotations_model import Cotation


def test_cotation_model_fields(colorized):
    """
    GIVEN the Cotation model
    WHEN I instanciate with right payload data
    THEN the attributes are setted correctly
    """

    data = {
        "id": uuid4(),
        "code": "USD-BRL",
        "label": "Dólar Americano - Real Brasileiro",
        "rate": 5.23,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
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

    data = {
        "code": "USD-BRL",
        "label": "Dólar Americano - Real Brasileiro",
        "rate": 5.23,
    }

    default_fields = (
        ("id", str),
        ("created_at", datetime),
        ("updated_at", datetime),
    )

    with app.app_context():
        session = app.db.session

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
