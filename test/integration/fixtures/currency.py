import pytest
from typing import Dict
from datetime import datetime

from model import Currency


@pytest.fixture(scope="function")
def fixture_currency():
    currencies = []

    def make(data: Dict = None):
        data = data if data else {}

        currency = {
            "name": "Brazilian real",
            "iso_code": "BRL",
            "creation_date": datetime.utcnow(),
            "update_date": datetime.utcnow(),
            **data,
        }

        currency_obj = Currency(**currency).save()

        currencies.append(currency_obj)

        return currency_obj

    yield make

    for c in currencies:
        c.delete()
