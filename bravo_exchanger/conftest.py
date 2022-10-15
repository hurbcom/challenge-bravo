import pytest
from faker import Faker

from currency.models import FictionalCurrency


@pytest.fixture
def currency_short_name(fake) -> str:
    return fake.currency_code()


@pytest.fixture
def fake() -> Faker:
    return Faker('pt_BR')


@pytest.fixture
def fictional_currency(fictional_currency_data) -> FictionalCurrency:
    return FictionalCurrency.objects.create(
        currency_amount = fictional_currency_data['currency_amount'],
        currency_backing = fictional_currency_data['currency_backing'],
        currency_short_name = fictional_currency_data['currency_short_name'],
    )


@pytest.fixture
def fictional_currency_data(currency_short_name, fake) -> dict:
    return {
        'currency_amount': fake.pyfloat(left_digits=2, positive=True, right_digits=2),
        'currency_backing': currency_short_name,
        'currency_short_name': fake.currency_code(),
    }
