from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.schemas.currency import Currency
from app.schemas.favorite import Favorite
from app.models import FavoriteCoin



TEST_CURRENCY_CODE_FANTASY = "HURB"


def test_found_in_db(client: TestClient, session: Session, create_hurb_quote: dict):
    """
    Try to add one currency that exist in db to favorite
    """
    currency = Currency(**create_hurb_quote)
    res = client.post(f"/favorite/{currency.currency_code}")
    res_data = res.json()["data"]

    assert res.status_code == 201
    assert res_data["currency_code"] == currency.currency_code
    assert res_data["currency_type"] == 'fantasy'

    favorite_db: FavoriteCoin = session.query(FavoriteCoin).filter(FavoriteCoin.currency_code == currency.currency_code).first()
    assert favorite_db != None
    assert favorite_db.currency_code == currency.currency_code
    assert favorite_db.currency_type == 'fantasy'


def test_not_found_in_db(client: TestClient):
    """
    Try to add one currency that do not exist in db to favorite
    """
    res = client.post(f"/favorite/{TEST_CURRENCY_CODE_FANTASY}")

    assert res.status_code == 404
    assert res.json()["detail"] == f"Currency code {TEST_CURRENCY_CODE_FANTASY} not found"


def test_oficial_found_in_favorite(client: TestClient, create_favorite_oficial: Favorite):
    """
    Try to add one oficial currency that do not exist in db to favorite
    """
    currency = Favorite(**create_favorite_oficial.dict())
    res = client.post(f"/favorite/{currency.currency_code}")

    assert res.status_code == 409
    assert res.json()["detail"] == f"Currency code {currency.currency_code} already added to favorites"


def test_fantasy_found_in_favorite(client: TestClient, create_favorite_fantasy: Favorite):
    """
    Try to add one fantasy currency that do not exist in db to favorite
    """
    currency = Favorite(**create_favorite_fantasy.dict())
    res = client.post(f"/favorite/{currency.currency_code}")

    assert res.status_code == 409
    assert res.json()["detail"] == f"Currency code {currency.currency_code} already added to favorites"
