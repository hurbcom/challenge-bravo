from fastapi.testclient import TestClient
from fastapi import status

from app.core.config import settings


def test_create_item(client: TestClient) -> None:
    data = {"code": "TST", "rate": 2.0}
    response = client.post(
        f"{settings.API_V1_STR}/currencies/", json=data,
    )
    assert response.status_code == status.HTTP_201_CREATED
    content = response.json()
    assert content["code"] == data["code"]
    assert content["rate"] == data["rate"]
    assert "id" in content


def test_read_currency(client: TestClient) -> None:
    code = "USD"
    response = client.get(f"{settings.API_V1_STR}/currencies/{code}")
    assert response.status_code == status.HTTP_200_OK
    content = response.json()
    assert content["code"] == code


def test_read_currency_not_exists(client: TestClient) -> None:
    code = "LLL"
    response = client.get(f"{settings.API_V1_STR}/currencies/{code}")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_currency(client: TestClient) -> None:
    currency = client.get(f"{settings.API_V1_STR}/currencies/EUR")
    assert currency.status_code == status.HTTP_200_OK
    currency = currency.json()

    data = {
        "code": "POL",
        "rate": "2.0"
    }

    response = client.put(f"{settings.API_V1_STR}/currencies/{currency['id']}", json=data)

    assert response.status_code == status.HTTP_200_OK
    content = response.json()
    assert content["code"] == data["code"]


def test_update_item_with_code_exists(client: TestClient) -> None:
    currency = client.get(f"{settings.API_V1_STR}/currencies/EUR")
    assert currency.status_code == status.HTTP_200_OK
    currency = currency.json()

    data = {"code": "USD", "rate": 2}
    response = client.put(f"{settings.API_V1_STR}/currencies/{currency['id']}", json=data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_update_item_not_exists(client: TestClient) -> None:
    data = {"code": "TST", "rate": 2}
    response = client.put(f"{settings.API_V1_STR}/currencies/999", json=data)

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_currency(client: TestClient) -> None:
    currency = client.get(f"{settings.API_V1_STR}/currencies/EUR")
    assert currency.status_code == status.HTTP_200_OK
    currency = currency.json()

    response = client.delete(f"{settings.API_V1_STR}/currencies/{currency['id']}")

    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_delete_currency_not_exists(client: TestClient) -> None:
    response = client.delete(f"{settings.API_V1_STR}/currencies/999")

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_exchange_currency(client: TestClient) -> None:
    response = client.get(f"{settings.API_V1_STR}/currencies/convert/?code_from=EUR&code_to=BRL&amount=1")

    assert response.status_code == status.HTTP_200_OK


def test_exchange_currency_doesnt_exists(client: TestClient) -> None:
    response = client.get(f"{settings.API_V1_STR}/currencies/convert/?code_from=PLO&code_to=BRL&amount=1")

    assert response.status_code == status.HTTP_404_NOT_FOUND
