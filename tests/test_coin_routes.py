from fastapi import status
from fastapi.testclient import TestClient

from challenge_bravo.main import app
from challenge_bravo.main import initialize_database
from challenge_bravo.models import Coin


client = TestClient(app)
initialize_database()


def test_list_default_coins():
    response = client.get('/api/v1/coins/')
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == [
        {
            'coin_id': 1,
            'name': 'United States Dollar',
            'code': 'USD',
            'price': 1,
            'base': 'USD'
        },
        {
            'coin_id': 2,
            'name': 'Brasilian Real',
            'code': 'BRL',
            'price': 0.19,
            'base': 'USD'
        },
        {
            'coin_id': 3,
            'name': 'Euro',
            'code': 'EUR',
            'price': 1.22,
            'base': 'USD'
        },
        {
            'coin_id': 4,
            'name': 'Bitcoin',
            'code': 'BTC',
            'price': 36281.5,
            'base': 'USD'
        },
        {
            'coin_id': 5,
            'name': 'Ether',
            'code': 'ETH',
            'price': 2556.54,
            'base': 'USD'
        }
    ]


def test_retrieve_existing_coin_success():
    response = client.get('/api/v1/coins/1')
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        'coin_id': 1,
        'name': 'United States Dollar',
        'code': 'USD',
        'price': 1,
        'base': 'USD'
    }


def test_retrieve_existing_coin_failure():
    response = client.get('/api/v1/coins/10')
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {
        'detail': 'No object found with the specified ID.'
    }


def test_coin_creation():
    coin = {
        'name': 'Test Coin',
        'code': 'TEST',
        'price': 10
    }
    response = client.post('/api/v1/coins/', json=coin)
    coin_response = Coin(**response.json())
    assert response.status_code == status.HTTP_201_CREATED
    assert coin_response.code == coin['code']


def test_coin_update_success():
    coin = {
        'name': 'Test Coin 2',
        'code': 'TEST2',
        'price': 12
    }
    response = client.patch('/api/v1/coins/6', json=coin)
    coin_response = Coin(**response.json())
    assert response.status_code == status.HTTP_200_OK
    assert coin_response.code == coin['code']


def test_coin_update_failure():
    coin = {
        'name': 'Test Coin 2',
        'code': 'TEST2',
        'price': 12
    }
    response = client.patch('/api/v1/coins/10', json=coin)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {
        'detail': 'No object found with the specified ID.'
    }


def test_coin_deletion_success():
    response = client.delete('/api/v1/coins/6')
    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_coin_deletion_failure():
    response = client.delete('/api/v1/coins/10')
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {
        'detail': 'No object found with the specified ID.'
    }


def test_coin_conversion_success():
    params = {
        'code_from': 'BTC',
        'code_to': 'BRL',
        'amount': 1.5
    }
    response = client.get('/api/v1/coins/convert', params=params)
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == 286432.89


def test_coin_conversion_failure():
    params = {
        'code_from': 'BTC',
        'code_to': 'TEST',
        'amount': 1.5
    }
    response = client.get('/api/v1/coins/convert', params=params)
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json() == {
        'detail': 'One or both codes sent, do not exist'
    }
