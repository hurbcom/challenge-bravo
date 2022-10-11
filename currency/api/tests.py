import json
from copy import deepcopy
from typing import Callable

import pytest
from django.forms.models import model_to_dict
from rest_framework import status

from currency.models import FictionalCurrency


pytestmark = pytest.mark.django_db


@pytest.fixture
def currency_short_name(fake) -> str:
    return fake.currency_code()


@pytest.fixture
def expected_currency(fictional_currency) -> dict:
    date_format = '%Y-%m-%dT%H:%M:%S.%fZ'

    expected_json_response = model_to_dict(fictional_currency, exclude='id')
    expected_json_response['created_at'] = fictional_currency.created_at.strftime(date_format)
    expected_json_response['updated_at'] = fictional_currency.updated_at.strftime(date_format)

    return expected_json_response


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
        'currency_amount': str(fake.pydecimal(left_digits=2, positive=True, right_digits=2)),
        'currency_backing': currency_short_name,
        'currency_short_name': fake.currency_code(),
    }


class TestFictionalCurrenciesView:
    @pytest.fixture
    def url(self) -> str:
        return '/api/currencies/'

    def test_get_without_currencies(self, client, url):
        response = client.get(url)

        assert response.json() == []
        assert response.status_code == status.HTTP_200_OK

    def test_get_with_currencies(self, client, expected_currency, url):
        response = client.get(url)

        assert response.json() == [expected_currency]
        assert response.status_code == status.HTTP_200_OK


class TestFictionalCurrencyView:
    @pytest.fixture
    def url(self, currency_short_name) -> str:
        def _url(currency_short_name=currency_short_name) -> Callable:
            return f'/api/currency/{currency_short_name}/'

        return _url

    def test_delete_with_currency_does_not_exist(self, client, url):
        response = client.delete(url())

        assert response.json() == {}
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_success(self, client, fictional_currency, url):
        assert FictionalCurrency.objects.exists()

        response = client.delete(url(fictional_currency.currency_short_name))

        assert not FictionalCurrency.objects.exists()

        assert response.json() == {}
        assert response.status_code == status.HTTP_200_OK

    def test_get_with_currency_does_not_exist(self, client, url):
        response = client.get(url())

        assert response.json() == {}
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_success(self, client, expected_currency, fictional_currency, url):
        response = client.get(url(fictional_currency.currency_short_name))

        assert response.json() == expected_currency
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.parametrize('field', ['currency_backing', 'currency_short_name'])
    def test_post_with_invalid_serializer(self, client, field, fictional_currency_data):
        new_currency = deepcopy(fictional_currency_data)
        new_currency.pop(field)

        url = '/api/currency/'
        response = client.post(url, content_type='application/json', data=json.dumps(new_currency))

        assert response.json() == {field: ['Este campo é obrigatório.']}
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_post_success(self, client, fake, fictional_currency_data, url):
        new_currency_name = fake.currency_code()

        new_currency = deepcopy(fictional_currency_data)
        new_currency['currency_short_name'] = new_currency_name

        assert not FictionalCurrency.objects.filter(currency_short_name=new_currency_name).exists()

        assert FictionalCurrency.objects.count() == 0

        url = '/api/currency/'
        response = client.post(url, content_type='application/json', data=json.dumps(new_currency))

        assert FictionalCurrency.objects.filter(currency_short_name=new_currency_name).exists()

        assert FictionalCurrency.objects.count() == 1

        assert response.status_code == status.HTTP_200_OK

    def test_put_with_currency_does_not_exist(self, client, url):
        response = client.put(url())

        assert response.json() == {}
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_put_success(self, client, fake, fictional_currency, url):
        new_currency_name = fake.currency_code()

        currency_data = model_to_dict(fictional_currency, exclude='id')
        currency_data['currency_short_name'] = new_currency_name

        assert not FictionalCurrency.objects.filter(currency_short_name=new_currency_name).exists()

        assert FictionalCurrency.objects.count() == 1

        response = client.put(
            url(fictional_currency.currency_short_name),
            content_type='application/json',
            data=json.dumps(currency_data)
        )

        assert FictionalCurrency.objects.filter(currency_short_name=new_currency_name).exists()

        assert FictionalCurrency.objects.count() == 1

        assert response.json() == currency_data
        assert response.status_code == status.HTTP_200_OK
