from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import FantasyCoin
from app.schemas import CurrencyInput



NEW_RATE = 50.41
NEW_AMOUNT = 120.45
NEW_BACKED_CURRENCY_AMOUNT = 33.80


def test_found_in_db(client: TestClient, session: Session, create_hurb_quote, fantasy_currency_data_hurb: dict):
    """
    Try to update a fantasy currency found in database
    """
    original_currency = CurrencyInput(**create_hurb_quote)
    currency_id_db = session.query(FantasyCoin.id).filter(FantasyCoin.currency_code == original_currency.currency_code).scalar()

    payload = fantasy_currency_data_hurb.copy()
    payload["rate"] = NEW_RATE

    res = client.put(f"/quote/{original_currency.currency_code}", json=payload)

    # validades response
    updated_currency = CurrencyInput(**payload)
    assert res.status_code == 200
    assert res.json()["currency_code"] == updated_currency.currency_code
    assert res.json()["rate"] == updated_currency.rate
    assert res.json()["backed_by"] == updated_currency.backed_by

    # validates database changes
    currency_db: FantasyCoin = session.query(FantasyCoin).filter(FantasyCoin.id == currency_id_db).first()
    assert currency_db.currency_code == updated_currency.currency_code
    assert currency_db.rate == updated_currency.rate
    assert currency_db.backed_by == updated_currency.backed_by


def test_not_found_in_db(client: TestClient, fantasy_currency_data_hurb: dict):
    """
    Try to update a fantasy currency not found in database
    """
    payload = fantasy_currency_data_hurb.copy()
    payload["rate"] = NEW_RATE
    updated_currency = CurrencyInput(**payload)

    res = client.put(f"/quote/{updated_currency.currency_code}", json=payload)
    assert res.status_code == 404


def test_not_found_in_db_alternative_input(client: TestClient, fantasy_currency_data_hurb_alternative_input: dict):
    """
    Try to update a fantasy currency not found in database using alternative body
    """
    payload = fantasy_currency_data_hurb_alternative_input.copy()
    payload["amount"] = NEW_AMOUNT
    payload["backed_currency_amount"] = NEW_BACKED_CURRENCY_AMOUNT
    updated_currency = CurrencyInput(**payload)

    res = client.put(f"/quote/{updated_currency.currency_code}", json=payload)
    assert res.status_code == 404


def test_found_in_db_alternative_input(client: TestClient, session: Session, create_hurb_quote, fantasy_currency_data_hurb_alternative_input: dict):
    """
    Try to update a fantasy currency found in database using alternative body
    """
    original_currency = CurrencyInput(**create_hurb_quote)
    currency_id_db = session.query(FantasyCoin.id).filter(FantasyCoin.currency_code == original_currency.currency_code).scalar()

    payload = fantasy_currency_data_hurb_alternative_input.copy()
    payload["amount"] = NEW_AMOUNT
    payload["backed_currency_amount"] = NEW_BACKED_CURRENCY_AMOUNT

    res = client.put(f"/quote/{original_currency.currency_code}", json=payload)

    # validades response
    updated_currency = CurrencyInput(**payload)
    assert res.status_code == 200
    assert res.json()["currency_code"] == updated_currency.currency_code
    assert res.json()["rate"] == updated_currency.rate
    assert res.json()["backed_by"] == updated_currency.backed_by

    # validates database changes
    currency_db: FantasyCoin = session.query(FantasyCoin).filter(FantasyCoin.id == currency_id_db).first()
    assert currency_db.currency_code == updated_currency.currency_code
    assert currency_db.rate == updated_currency.rate
    assert currency_db.backed_by == updated_currency.backed_by


def test_found_in_db_missing_field(client: TestClient, session: Session, create_hurb_quote, fantasy_currency_data_hurb_missing_field_input: dict):
    """
    Try to update a fantasy currency found in database missing a required field
    """
    original_currency = CurrencyInput(**create_hurb_quote)
    currency_id_db = session.query(FantasyCoin.id).filter(FantasyCoin.currency_code == original_currency.currency_code).scalar()

    payload = fantasy_currency_data_hurb_missing_field_input.copy()
    payload["amount"] = NEW_AMOUNT

    res = client.put(f"/quote/{original_currency.currency_code}", json=payload)

    # validades response
    assert res.status_code == 422
    assert res.json()["detail"][0]["msg"] == "You should provide whether a rate field or an amount and backed_currency_amount fields"

    # validates database changes
    currency_db: FantasyCoin = session.query(FantasyCoin).filter(FantasyCoin.id == currency_id_db).first()
    assert currency_db.currency_code == original_currency.currency_code
    assert currency_db.rate == original_currency.rate
    assert currency_db.backed_by == original_currency.backed_by


def test_found_in_db_providing_all_fields_in_body(client: TestClient, create_hurb_quote, fantasy_currency_data_hurb_all_fields_input: dict):
    """
    Try to update fantasy currency using invalid body with all possible fields provided and asserts an error
    """
    res = client.post("/quote/", json=fantasy_currency_data_hurb_all_fields_input)
    assert res.status_code == 422
    assert res.json()["detail"][0]["msg"] == "You should provide only a rate field or an amount and backed_currency_amount fields"