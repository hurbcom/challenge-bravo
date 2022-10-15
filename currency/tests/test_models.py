import pytest

from currency.models import FictionalCurrency


pytestmark = pytest.mark.django_db


class TestFictionalCurrency:
    def test_get_currency_base_data_with_real_currency(self, currency_short_name):
        expected_currency_data = {
            'currency_amount': 1.0,
            'currency_backing': currency_short_name,
            'currency_name': currency_short_name,
            'is_fictional': False,
        }

        currency_data = FictionalCurrency.get_currency_base_data(currency_short_name)

        assert currency_data == expected_currency_data

    def test_get_currency_base_data_with_fictional_currency(self, fictional_currency):
        expected_currency_data = {
            'currency_amount': float(fictional_currency.currency_amount),
            'currency_backing': fictional_currency.currency_backing,
            'currency_name': fictional_currency.currency_short_name,
            'is_fictional': True,
        }

        currency_data = FictionalCurrency.get_currency_base_data(
            fictional_currency.currency_short_name
        )

        assert currency_data == expected_currency_data
