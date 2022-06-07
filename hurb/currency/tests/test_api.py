import pytest
import requests
from model_bakery import baker
from rest_framework import status

from hurb.currency.models import Currency


@pytest.fixture
def fict_currency(db):
    return baker.make(Currency)


class TestConvertCurrency:
    def test_use_currency_api(self):
        of = 'USD'
        to = 'BRL'
        response = requests.get(f'https://economia.awesomeapi.com.br/last/{of}-{to}')

        assert response.status_code == 200

    def test_get_convert_currency(self, api_client, user):
        api_client.force_authenticate(user)

        of = 'USD'
        to = 'BRL'
        response = api_client.get(f'/v1/convert/from={of}&to={to}&amount=5/')
        assert response.status_code == status.HTTP_200_OK

    def test_get_convert_currency_bd(self, api_client, user, fict_currency):
        api_client.force_authenticate(user)

        of = fict_currency.name
        to = 'USD'

        response = api_client.get(f'/v1/convert/from={to}&to={of}&amount=1/')

        assert response.status_code == status.HTTP_200_OK
