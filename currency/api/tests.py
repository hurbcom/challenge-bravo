import pytest
from django.forms.models import model_to_dict
from rest_framework import status

from currency.models import FictionalCurrency


pytestmark = pytest.mark.django_db


class TestFictionalCurrenciesView:
    @pytest.fixture
    def expected_currencies(self, fictional_currency):
        date_format = '%Y-%m-%dT%H:%M:%S.%fZ'

        expected_json_response = model_to_dict(fictional_currency, exclude='id')
        expected_json_response['created_at'] = fictional_currency.created_at.strftime(date_format)
        expected_json_response['updated_at'] = fictional_currency.updated_at.strftime(date_format)

        return [expected_json_response]

    @pytest.fixture
    def fictional_currency(self):
        return FictionalCurrency.objects.create(
            currency_backing='USD',
            currency_amount='5.00',
            currency_short_name='TEST'
        )

    @pytest.fixture
    def url(self):
        return '/api/currencies/'

    def test_get_without_currencies(self, client, url):
        response = client.get(url)

        assert response.json() == []
        assert response.status_code == status.HTTP_200_OK

    def test_get_with_currencies(self, client, expected_currencies, url):
        response = client.get(url)

        assert response.json() == expected_currencies
        assert response.status_code == status.HTTP_200_OK


class TestFictionalCurrencyView:
    @pytest.fixture
    def url(self) -> str:
        return '/api/currency/USD/'

    def test_delete_with_currency_does_not_exist(self, client, url):
        response = client.delete(url)

        assert response.json() == {}
        assert response.status_code == status.HTTP_404_NOT_FOUND
