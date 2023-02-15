import asyncio
import pytest
from unittest import mock
from unittest.mock import patch
from app.routers.convert_router import router
from fastapi.testclient import TestClient
from app.repositories.convert_repository import ConvertRepository
from app.models.models import CurrencyInfoModel
from fastapi import HTTPException

@patch.object(
    ConvertRepository,
    "find_currency_in_db",
    return_value=mock.AsyncMock(),
)
@patch.object(
    ConvertRepository,
    "find_currency_backed_by",
    return_value=mock.AsyncMock(),
)
def test_convert_currencies(mock_convert_currencies, mock_convert_backed_currencies):
    future = asyncio.Future()
    obj = CurrencyInfoModel(
        currency_code="USD",
        rate=1.22,
        backed_by="EUR",
        updated_at="2021-08-10T13:00:00",
        currency_type="coinbase",
    )
    future.set_result([obj])
    mock_convert_currencies.return_value = future.result()
    client = TestClient(router)
    response = client.get(
        "/convert?from_this=USD&to=EUR&amount=1",
    )
    assert response.status_code == 200

@patch.object(
    ConvertRepository,
    "find_currency_in_db",
    return_value=mock.AsyncMock(),
)
@patch.object(
    ConvertRepository,
    "find_currency_backed_by",
    return_value=mock.AsyncMock(),
)
def test_convert_currencies_error(mock_convert_currencies, mock_convert_backed_currencies):
    future = asyncio.Future()
    future.set_result(None)
    mock_convert_currencies.return_value = future.result()
    mock_convert_backed_currencies.return_value = future.result()
    client = TestClient(router)
    with pytest.raises(HTTPException) as err:
        client.get("/convert?from_this=USD&to=EUR&amount=1")
    assert err.value.status_code == 404
