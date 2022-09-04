from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import FavoriteCoin
from app.schemas.favorite import Favorite



def test_oficial_found_in_db(client: TestClient, session: Session, create_favorite_oficial: Favorite):
    """
    Try to remove one oficial currency that exists in db to favorite
    """
    favorite = create_favorite_oficial
    res = client.delete(f"/favorite/{favorite.currency_code}")
    assert res.status_code == 204

    favorite_db = session.query(FavoriteCoin).filter(FavoriteCoin.currency_code == favorite.currency_code).first()
    assert favorite_db == None


def test_oficial_not_found_in_db(client: TestClient, oficial_dummy_data: dict):
    """
    Try to remove one oficial currency that do not exists in db to favorite
    """
    res = client.delete(f"/favorite/{oficial_dummy_data['currency_code']}")
    assert res.status_code == 404
    assert res.json()['detail'] == f"Currency code {oficial_dummy_data['currency_code']} not found in favorites"


def test_fantasy_found_in_db(client: TestClient, session: Session, create_favorite_fantasy):
    """
    Try to remove one fantasy currency that exist in db to favorite
    """
    favorite = create_favorite_fantasy
    res = client.delete(f"/favorite/{favorite.currency_code}")

    assert res.status_code == 204
    favorite_db = session.query(FavoriteCoin).filter(FavoriteCoin.currency_code == favorite.currency_code).first()
    assert favorite_db == None


def test_fantasy_not_found_in_db(client: TestClient, fantasy_dummy_data: dict):
    """
    Try to remove one fantasy currency that do not exists in db to favorite
    """
    res = client.delete(f"/favorite/{fantasy_dummy_data['currency_code']}")
    assert res.status_code == 404
    assert res.json()['detail'] == f"Currency code {fantasy_dummy_data['currency_code']} not found in favorites"
