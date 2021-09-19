import os

import pytest
from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_convert_currency():
    response = client.get("/conversao", params={"orig": "USD", "dest": "BRL", "orig_value": 1},
                          headers={"x-api-key": os.getenv("api-key")})
    assert response.status_code == 200
    assert response.json()['orig'] == "USD"
    assert response.json()['dest'] == "BRL"
    assert response.json()['orig_value'] == 1
    assert type(response.json()['converted_value']) == float


def test_authentication_error():
    response = client.get("/conversao", params={"orig": "USD", "dest": "BRL", "orig_value": 1},
                          )
    assert response.status_code == 403


def test_non_existent_currency():
    response = client.get("/conversao", params={"orig": "HGHGH", "dest": "BRL", "orig_value": 1},
                          headers={"x-api-key": os.getenv("api-key")})
    assert response.status_code == 400
    response = client.get("/conversao", params={"orig": "USD", "dest": "HUAHUSHU", "orig_value": 1},
                          headers={"x-api-key": os.getenv("api-key")})
    assert response.status_code == 400


def test_invalid_input_types():
    response = client.get("/conversao", params={"orig": "USD", "dest": "BRL", "orig_value": "abc"},
                          headers={"x-api-key": os.getenv("api-key")})
    assert response.status_code == 422
    response = client.get("/conversao", params={"orig": 123, "dest": "BRL", "orig_value": 1},
                          headers={"x-api-key": os.getenv("api-key")})
    assert response.status_code == 400


def test_verifica_moedas_permitidas():
    response = client.get("/currency", headers={"x-api-key": os.getenv("api-key")})
    assert response.status_code == 200
    assert "BRL" in response.json()


def test_apaga_moeda_permitidas():
    response = client.delete("/currency/CAD", headers={"x-api-key": os.getenv("api-key")})
    assert response.status_code == 200
    assert response.json() == {
        "name": "CAD",
        "success": True
    }


def test_insere_moeda_default():
    response = client.post("/currency/CAD", headers={"x-api-key": os.getenv("api-key")})
    assert response.status_code == 200
    assert response.json() == {
        "name": "CAD",
        "success": True
    }

def test_insere_moeda_custom():
    os.chdir("../")
    files = {'file': ('GTACustomCurrency.py', open('./example_custom_currencies/GTACustomCurrency.py', 'rb'))}
    response = client.post("custom/currency", headers={"x-api-key": os.getenv("api-key")}, files=files)
    assert response.status_code == 200
    assert response.json() == {
        "name": "GTA",
        "success": True
    }
