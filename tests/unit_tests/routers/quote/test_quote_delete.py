from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import FantasyCoin, FavoriteCoin, OficialCoin
from app.schemas.currency import CurrencyInput
from app.schemas.favorite import Favorite



TEST_FANTASY_CURRENCY_CODE = "HURB"
TEST_OFICIAL_CURRENCY_CODE = "BRL"


def test_found_in_db(client: TestClient, session: Session, create_hurb_quote: CurrencyInput, create_favorite_fantasy: Favorite):
    """
    Try to delete a fantasy currency found in database
    """
    currency = CurrencyInput(**create_hurb_quote)
    res = client.delete(f"/quote/{currency.currency_code}")

    # validades response
    assert res.status_code == 204
    # validates database changes
    currency_db: FantasyCoin = session.query(FantasyCoin).filter(FantasyCoin.currency_code == currency.currency_code).first()
    assert currency_db == None

    currency_favorite_db: FavoriteCoin = session.query(FavoriteCoin).filter(FavoriteCoin.currency_code == currency.currency_code).first()
    assert currency_favorite_db == None


def test_not_found_in_db(client: TestClient, session: Session):
    """
    Try to delete a fantasy currency not found in database
    """
    res = client.delete(f"/quote/{TEST_FANTASY_CURRENCY_CODE}")

    # validades response
    assert res.status_code == 404
    # validates database changes
    currency_db: FantasyCoin = session.query(FantasyCoin).filter(FantasyCoin.currency_code == TEST_FANTASY_CURRENCY_CODE).first()
    assert currency_db == None


def test_found_in_db_not_fantasy_currency(client: TestClient, session: Session, create_favorite_oficial: Favorite):
    """
    Try to delete an oficial currency found in database
    """
    res = client.delete(f"/quote/{TEST_OFICIAL_CURRENCY_CODE}")

    # validades response
    assert res.status_code == 409
    # validates database changes
    currency_db: OficialCoin = session.query(OficialCoin).filter(OficialCoin.currency_code == TEST_OFICIAL_CURRENCY_CODE).first()
    assert currency_db != None
    currency_favorite_db: FavoriteCoin = session.query(FavoriteCoin).filter(FavoriteCoin.currency_code == TEST_OFICIAL_CURRENCY_CODE).first()
    assert currency_favorite_db != None