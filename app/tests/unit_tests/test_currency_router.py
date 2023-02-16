import asyncio
import pytest
from unittest import mock
from unittest.mock import patch
from fastapi import HTTPException
from fastapi.testclient import TestClient
from app.routers.currency_router import router
from app.repositories.currency_repository import CurrencyRepository

@patch("app.repositories.currency_repository.CurrencyRepository.read_all")
def test_read_all_currencies(mock_get_currencies):
    mock_get_currencies.return_value = [
        {"id": 1, "currency_code": "USD", "rate": 1.0, "backed_by": "USD", "updated_at": "2022-02-13T12:00:00.000000", "currency_type": "fiat"}
    ]
    client = TestClient(router)
    response = client.get("/currency/")
    assert response.status_code == 200

@patch("app.services.currency_service.CurrencyService.create_currency")
def test_create_currency(mock_create_currency):
    mock_create_currency.return_value = {"id": 1}
    client = TestClient(router)
    response = client.post("/currency/", json={"currency_code": "USD", "rate": 1.0, "backed_by": "USD", "currency_type": "fiat"})
    assert response.status_code == 201

@patch.object(
    CurrencyRepository,
    "create",
    return_value=mock.AsyncMock(),
)
def test_create_currency_error(mock_create_currency):
    future = asyncio.Future()
    future.set_result(None)
    mock_create_currency.return_value = future.result()
    client = TestClient(router)
    with pytest.raises(HTTPException) as err:
        client.post("/currency/", json={"currency_code": "USD", "rate": 1.0, "backed_by": "USD", "currency_type": "fiat"})
    assert err.value.status_code == 409

@patch("app.repositories.currency_repository.CurrencyRepository.find_currency_by_id_in_db")
@patch("app.repositories.currency_repository.CurrencyRepository.read")
def test_read_currency(mock_get_currency, mock_find_currency):
    mock_get_currency.return_value = {"id": 1, "currency_code": "USD", "rate": 1.0, "backed_by": "USD", "updated_at": "2022-02-13T12:00:00.000000", "currency_type": "fiat"}
    client = TestClient(router)
    response = client.get("/currency/1")
    assert response.status_code == 200

@patch.object(
    CurrencyRepository,
    "find_currency_by_id_in_db",
    return_value=mock.AsyncMock(),
)
@patch.object(
    CurrencyRepository,
    "read",
    return_value=mock.AsyncMock(),
)
def test_read_currency_error(mock_get_currency, mock_find_currency):
    future = asyncio.Future()
    future.set_result(None)
    mock_get_currency.return_value = future.result()
    mock_find_currency.return_value = future.result()
    client = TestClient(router)
    with pytest.raises(HTTPException) as err:
        client.get("/currency/1")
    assert err.value.status_code == 404


@patch("app.repositories.currency_repository.CurrencyRepository.find_currency_by_id_in_db")
@patch("app.repositories.currency_repository.CurrencyRepository.update")
def test_update_currency(mock_update_currency, mock_find_currency):
    mock_update_currency.return_value = {"id": 1, "currency_code": "USD", "rate": 1.0, "backed_by": "USD", "updated_at": "2022-02-13T12:00:00.000000", "currency_type": "fiat"}
    client = TestClient(router)
    response = client.put("/currency/1", json={"currency_code": "USD", "rate": 1.0, "backed_by": "USD", "currency_type": "fiat"})
    assert response.status_code == 200

@patch.object(
    CurrencyRepository,
    "find_currency_by_id_in_db",
    return_value=mock.AsyncMock(),
)
@patch.object(
    CurrencyRepository,
    "update",
    return_value=mock.AsyncMock(),
)
def test_update_currency_error(mock_update_currency, mock_find_currency):
    future = asyncio.Future()
    future.set_result(None)
    mock_update_currency.return_value = future.result()
    mock_find_currency.return_value = future.result()
    client = TestClient(router)
    with pytest.raises(HTTPException) as err:
        client.put("/currency/1", json={"currency_code": "USD", "rate": 1.0, "backed_by": "USD", "currency_type": "fiat"})
    assert err.value.status_code == 404

@patch("app.repositories.currency_repository.CurrencyRepository.find_currency_by_id_in_db")
@patch("app.repositories.currency_repository.CurrencyRepository.delete")
def test_delete_currency(mock_delete_currency, mock_find_currency):
    mock_delete_currency.return_value = {"id": 1, "currency_code": "USD", "rate": 1.0, "backed_by": "USD", "updated_at": "2022-02-13T12:00:00.000000", "currency_type": "fiat"}
    client = TestClient(router)
    response = client.delete("/currency/1")
    assert response.status_code == 200

@patch.object(
    CurrencyRepository,
    "find_currency_by_id_in_db",
    return_value=mock.AsyncMock(),
)
@patch.object(
    CurrencyRepository,
    "delete",
    return_value=mock.AsyncMock(),
)
def test_delete_currency_error(mock_delete_currency, mock_find_currency):
    future = asyncio.Future()
    future.set_result(None)
    mock_delete_currency.return_value = future.result()
    mock_find_currency.return_value = future.result()
    client = TestClient(router)
    with pytest.raises(HTTPException) as err:
        client.delete("/currency/1")
    assert err.value.status_code == 404