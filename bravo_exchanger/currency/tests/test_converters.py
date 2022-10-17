from copy import deepcopy

import pytest
from unittest.mock import patch

from currency.converters import get_currency_conversion_data


class TestGetCurrencyConversionData:
    @pytest.fixture
    def amount(self) -> float:
        return 1.0

    @pytest.fixture
    def currency(self) -> dict:
        return {'currency_amount': 1.0, 'currency_backing': 'USD', 'is_fictional': True}

    @pytest.fixture
    def currency_from(self, currency, fake) -> dict:
        currency_from = deepcopy(currency)
        currency_from['currency_short_name'] = fake.currency_code()

        return currency_from

    @pytest.fixture
    def currency_quote(self, fake) -> float:
        return fake.pyfloat(left_digits=2, positive=True, right_digits=2)

    @pytest.fixture
    def currency_to(self, currency, fake):
        currency_from = deepcopy(currency)
        currency_from['currency_short_name'] = fake.currency_code()
        currency_from['currency_backing'] = 'EUR'

        return currency_from

    def test_get_currency_conversion_data_with_equals_currency_backing(
        self, amount, currency_from, currency_to
    ):
        currency_to['currency_backing'] = currency_from['currency_backing']

        expected_conversion_value = (
            (currency_from['currency_amount'] * amount) / currency_to['currency_amount']
        )

        response = get_currency_conversion_data(amount, currency_from, currency_to)

        assert response == expected_conversion_value

    @patch('currency.converters.get_quote')
    def test_get_currency_conversion_data_with_real_currency_conversion(
        self, mock_get_quote, amount, currency_from, currency_quote, currency_to
    ):
        currency_from['is_fictional'] = False
        currency_to['is_fictional'] = False

        mock_get_quote.return_value = currency_quote

        response = get_currency_conversion_data(amount, currency_from, currency_to)

        assert response == (amount * currency_quote)

        mock_get_quote.assert_called_once_with(
            currency_from['currency_backing'], currency_to['currency_backing']
        )

    @patch('currency.converters.get_quote')
    def test_get_currency_conversion_data_with_real_and_fictional_currency_conversion(
        self, mock_get_quote, amount, currency_from, currency_quote, currency_to
    ):
        currency_to['is_fictional'] = False

        total_currency_value = currency_from['currency_amount'] * currency_quote

        mock_get_quote.return_value = currency_quote

        response = get_currency_conversion_data(amount, currency_from, currency_to)

        assert response == (total_currency_value * amount) / currency_to['currency_amount']

        mock_get_quote.assert_called_once_with(
            currency_from['currency_backing'], currency_to['currency_backing']
        )
