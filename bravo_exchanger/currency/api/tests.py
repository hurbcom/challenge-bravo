import json
from copy import deepcopy
from http import HTTPStatus
from typing import Callable
from unittest.mock import patch

import pytest
from currency.errors import CurrencyUnknownError
from django.forms.models import model_to_dict
from rest_framework import status

from currency.models import FictionalCurrency


pytestmark = pytest.mark.django_db


@pytest.fixture
def expected_currency(fictional_currency) -> dict:
    return model_to_dict(fictional_currency, exclude='id')


class TestConvertCurrencyView:
    @pytest.fixture
    def params_request(self) -> dict:
        return {'amount': 1.0, 'from': 'USD', 'to': 'USD'}

    @pytest.fixture
    def url(self) -> str:
        return '/api/convert/'

    @patch('currency.api.views.cache')
    def test_get_with_cached_value(self, mock_cache, client, params_request, url):
        cache_key = f'{params_request["from"]}.{params_request["to"]}.{params_request["amount"]}'

        mock_cache.get.return_value = 1.0

        response = client.get(url, data=params_request)

        assert response.json() == 1.0
        assert response.reason_phrase == HTTPStatus.OK.phrase
        assert response.status_code == HTTPStatus.OK

        mock_cache.get.assert_called_once_with(cache_key)

    @pytest.mark.parametrize('field', ['from', 'to'])
    @patch('currency.api.views.cache')
    def test_get_without_currency_value(self, mock_cache, client, field, params_request, url):
        params = deepcopy(params_request)
        params.pop(field)

        mock_cache.get.return_value = False

        response = client.get(url, data=params)

        assert response.json() == {}
        assert response.reason_phrase == HTTPStatus.UNPROCESSABLE_ENTITY.phrase
        assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY

        mock_cache.set.assert_not_called()

    @patch('currency.api.views.FictionalCurrency.get_currency_base_data')
    @patch('currency.api.views.cache')
    def test_get_with_currency_unknown_error(
        self, mock_cache, mock_get_currency_base_data, client, params_request, url
    ):
        currency_from = params_request['from']

        expected_message_response = f'Currency "{currency_from}" is not valid'

        mock_cache.get.return_value = False

        mock_get_currency_base_data.side_effect = CurrencyUnknownError

        response = client.get(url, data=params_request)

        assert response.json() == {'message': expected_message_response}
        assert response.reason_phrase == HTTPStatus.UNPROCESSABLE_ENTITY.phrase
        assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY

        mock_cache.set.assert_not_called()

    @patch('currency.api.views.get_currency_conversion_data')
    @patch('currency.api.views.FictionalCurrency.get_currency_base_data')
    @patch('currency.api.views.cache')
    def test_get_with_success(
        self,
        mock_cache,
        mock_get_currency_base_data,
        mock_get_currency_conversion_data,
        client,
        currency_short_name,
        params_request,
        url
    ):
        currency_base_data = {
            'currency_amount': '1.0',
            'currency_backing': currency_short_name,
            'currency_name': currency_short_name,
            'is_fictional': False,
        }

        mock_cache.get.return_value = False

        mock_get_currency_base_data.return_value = currency_base_data

        mock_get_currency_conversion_data.return_value = 1.0

        response = client.get(url, data=params_request)

        assert response.json() == 1.0
        assert response.reason_phrase == HTTPStatus.OK.phrase
        assert response.status_code == HTTPStatus.OK

        mock_cache.set.assert_called_once()
        mock_get_currency_base_data.assert_called()
        mock_get_currency_conversion_data.assert_called()


class TestFictionalCurrenciesView:
    @pytest.fixture
    def url(self) -> str:
        return '/api/fictional-currencies/'

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
    def base_url(self):
        return '/api/fictional-currency/'

    @pytest.fixture
    def url(self, base_url, currency_short_name) -> str:
        def _url(currency_short_name=currency_short_name) -> Callable:
            return f'{base_url}{currency_short_name}/'

        return _url

    def test_delete_with_currency_does_not_exist(self, client, url):
        response = client.delete(url())

        assert response.json() == {}
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_success(self, client, fictional_currency, url):
        assert FictionalCurrency.objects.exists()

        response = client.delete(url(fictional_currency.currency_short_name))

        assert not FictionalCurrency.objects.exists()

        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_get_with_currency_does_not_exist(self, client, url):
        response = client.get(url())

        assert response.json() == {}
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_success(self, client, expected_currency, fictional_currency, url):
        response = client.get(url(fictional_currency.currency_short_name))

        assert response.json() == expected_currency
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.parametrize('field', ['currency_backing', 'currency_short_name'])
    def test_post_with_invalid_serializer(self, base_url, client, field, fictional_currency_data):
        new_currency = deepcopy(fictional_currency_data)
        new_currency.pop(field)

        response = client.post(
            base_url, content_type='application/json', data=json.dumps(new_currency)
        )

        assert response.json() == {field: ['Este campo é obrigatório.']}
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_post_success(self, base_url, client, fake, fictional_currency_data, url):
        new_currency_name = fake.currency_code()

        new_currency = deepcopy(fictional_currency_data)
        new_currency['currency_short_name'] = new_currency_name

        assert not FictionalCurrency.objects.filter(currency_short_name=new_currency_name).exists()

        assert FictionalCurrency.objects.count() == 0

        response = client.post(
            base_url, content_type='application/json', data=json.dumps(new_currency)
        )

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
