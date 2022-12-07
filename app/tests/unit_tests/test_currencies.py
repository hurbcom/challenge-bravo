from sqlalchemy.orm import Session

from app.models import CurrenciesCoinsbaseModel
from app.schemas.currencies import CurrencyInput

import pytest

from fastapi.testclient import TestClient

from app.schemas.currencies import Currency

TEST_CREATED_CURRENCY_CODE = "HURB"
TEST_COINBASE_CURRENCY_CODE = "BRL"

# CREATE OPERATIONS
def test_should_not_create_existing_currency_in_database(
    client: TestClient, real_currency_data_brl: dict
):
    response = client.post("/currencies/", json=real_currency_data_brl)
    assert response.status_code == 409
    assert (
        response.json()["detail"]
        == f"Currency code {real_currency_data_brl['currency_code']} already exists"
    )


def test_should_create_currency_that_not_exists_in_database(
    client: TestClient, created_currency_data_hurb: dict
):
    response = client.post("/currencies/", json=created_currency_data_hurb)
    print(response.json())
    res_data = response.json()["data"]

    assert response.status_code == 201
    assert res_data["currency_code"] == created_currency_data_hurb["currency_code"]
    assert res_data["rate"] == created_currency_data_hurb["rate"]
    assert res_data["backed_by"] == created_currency_data_hurb["backed_by"]


def test_should_create_currency_with_alternative_body(
    client: TestClient, created_currency_data_hurb_alternative_input
):
    payload = created_currency_data_hurb_alternative_input
    response = client.post("/currencies/", json=payload)
    res_data = response.json()["data"]

    assert response.status_code == 201
    assert res_data["currency_code"] == payload["currency_code"]
    assert res_data["rate"] == payload["amount"] / payload["backed_currency_amount"]
    assert res_data["backed_by"] == payload["backed_by"]


def test_should_not_create_currency_with_missing_fields_in_body(
    client: TestClient, created_currency_data_hurb_missing_field_input: dict
):
    response = client.post(
        "/currencies/", json=created_currency_data_hurb_missing_field_input
    )

    assert response.status_code == 422
    assert (
        response.json()["detail"][0]["msg"]
        == "Needs provide rate field or an amount with backed_currency_amount"
    )


def test_should_not_create_currency_with_wrong_fields_in_body(
    client: TestClient, created_currency_data_hurb_all_fields_input: dict
):
    response = client.post("/currencies/", json=created_currency_data_hurb_all_fields_input)

    assert response.status_code == 422
    assert (
        response.json()["detail"][0]["msg"]
        == "Needs provide only a rate field or amount with backed_currency_amount fields"
    )

# READ OPERATIONS
@pytest.mark.parametrize(
    "index, expected_currency_code, expected_rate, expected_backed_by, expected_currency_type",
    [
        (0, "BRL", 5.12, "USD", "coinbase"),
        (1, "BTC", 0.00005, "USD", "coinbase"),
        (2, "ETH", 0.0006, "USD", "coinbase"),
        (3, "EUR", 1.01, "USD", "coinbase"),
        (4, "USD", 1.0, "USD", "coinbase"),
    ],
)
def test_should_get_all_currencies_in_db(
    client: TestClient,
    index,
    expected_currency_code,
    expected_rate,
    expected_backed_by,
    expected_currency_type,
):
    response = client.get("/currencies/")
    res_data = response.json()["data"][index]

    assert response.status_code == 200
    assert res_data["currency_code"] == expected_currency_code
    assert res_data["rate"] == expected_rate
    assert res_data["backed_by"] == expected_backed_by
    assert res_data["currency_type"] == expected_currency_type


@pytest.mark.parametrize(
    "currency_code, expected_rate, expected_backed_by, expected_currency_type",
    [
        ("BRL", 5.12, "USD", "coinbase"),
        ("BTC", 0.00005, "USD", "coinbase"),
        ("ETH", 0.0006, "USD", "coinbase"),
        ("EUR", 1.01, "USD", "coinbase"),
        ("USD", 1.0, "USD", "coinbase"),
    ],
)
def test_should_get_specific_existing_currency_in_db(
    client: TestClient,
    currency_code,
    expected_rate,
    expected_backed_by,
    expected_currency_type,
):
    response = client.get(f"/currencies/{currency_code}/")
    res_data = response.json()["data"]

    assert response.status_code == 200
    assert res_data["currency_code"] == currency_code
    assert res_data["backed_by"] == expected_backed_by
    assert res_data["rate"] == expected_rate
    assert res_data["currency_type"] == expected_currency_type


def test_should_not_get_non_existing_currency_in_db(client: TestClient):
    currency_code = "HURB"
    response = client.get(f"/currencies/{currency_code}/")
    assert response.status_code == 404


def test_should_get_existing_currency_in_db(
    client: TestClient, create_hurb_currency: dict
):
    currency = Currency(**create_hurb_currency)
    response = client.get(f"/currencies/{currency.currency_code}/")
    res_data = response.json()["data"]
    assert response.status_code == 200
    assert res_data["currency_code"] == currency.currency_code

# UPDATE OPERATIONS

NEW_RATE = 50.41
NEW_AMOUNT = 120.45
NEW_BACKED_CURRENCY_AMOUNT = 33.80


def test_should_update_existing_currency_in_database(
    client: TestClient,
    session: Session,
    create_hurb_currency,
    created_currency_data_hurb: dict,
):
    original_currency = CurrencyInput(**create_hurb_currency)
    currency_id_db = (
        session.query(CurrenciesCoinsbaseModel.id)
        .filter(
            CurrenciesCoinsbaseModel.currency_code
            == original_currency.currency_code
        )
        .scalar()
    )

    payload = created_currency_data_hurb.copy()
    payload["rate"] = NEW_RATE

    response = client.put(f"/currencies/{original_currency.currency_code}", json=payload)
    res_data = response.json()["data"]

    updated_currency = CurrencyInput(**payload)
    assert response.status_code == 200
    assert res_data["currency_code"] == updated_currency.currency_code
    assert res_data["rate"] == updated_currency.rate
    assert res_data["backed_by"] == updated_currency.backed_by


def test_should_not_update_currency_not_found_in_db(
    client: TestClient, created_currency_data_hurb: dict
):
    payload = created_currency_data_hurb.copy()
    payload["rate"] = NEW_RATE
    updated_currency = CurrencyInput(**payload)

    response = client.put(f"/currencies/{updated_currency.currency_code}", json=payload)
    assert response.status_code == 404

def test_should_not_update_currency_found_in_db_with_missing_field(
    client: TestClient,
    session: Session,
    create_hurb_currency,
    created_currency_data_hurb_missing_field_input: dict,
):
    original_currency = CurrencyInput(**create_hurb_currency)
    currency_id_db = (
        session.query(CurrenciesCoinsbaseModel.id)
        .filter(
            CurrenciesCoinsbaseModel.currency_code
            == original_currency.currency_code
        )
        .scalar()
    )

    payload = created_currency_data_hurb_missing_field_input.copy()
    payload["amount"] = NEW_AMOUNT

    response = client.put(f"/currencies/{original_currency.currency_code}", json=payload)

    assert response.status_code == 422
    assert (
        response.json()["detail"][0]["msg"]
        == "Needs provide rate field or an amount with backed_currency_amount"

    )


def test_should_update_currency_found_in_db_providing_invalid_fields_in_body(
    client: TestClient,
    create_hurb_currency: dict,
    created_currency_data_hurb_all_fields_input: dict,
):
    response = client.put(
        f"/currencies/{create_hurb_currency['currency_code']}",
        json=created_currency_data_hurb_all_fields_input,
    )
    assert response.status_code == 422
    assert (
        response.json()["detail"][0]["msg"]
        == "Needs provide only a rate field or amount with backed_currency_amount fields"
    )


def test_should_not_update_coinbase_api_currency_found_in_db(
    client: TestClient, real_currency_data_brl, created_currency_data_test: dict
):
    response = client.put(
        f"/currencies/{real_currency_data_brl['currency_code']}",
        json=created_currency_data_test,
    )
    assert response.status_code == 409
    assert (
        response.json()["detail"]
        == f"Currency code {real_currency_data_brl['currency_code']} is an coinbase currency and cannot be changed"
    )
# DELETE OPERATIONS
def test_found_in_db(
    client: TestClient, session: Session, create_hurb_currency: CurrencyInput
):
    currency = CurrencyInput(**create_hurb_currency)
    response = client.delete(f"/currencies/{currency.currency_code}")
    assert response.status_code == 204
    currency_db: CurrenciesCoinsbaseModel = (
        session.query(CurrenciesCoinsbaseModel)
        .filter(
            CurrenciesCoinsbaseModel.currency_code == currency.currency_code
        )
        .first()
    )
    assert currency_db is None


def test_not_found_in_db(client: TestClient, session: Session):
    response = client.delete(f"/currencies/{TEST_CREATED_CURRENCY_CODE}")

    assert response.status_code == 404
    currency_db: CurrenciesCoinsbaseModel = (
        session.query(CurrenciesCoinsbaseModel)
        .filter(
            CurrenciesCoinsbaseModel.currency_code
            == TEST_CREATED_CURRENCY_CODE
        )
        .first()
    )
    assert currency_db is None
