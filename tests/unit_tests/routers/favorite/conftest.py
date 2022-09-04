import pytest
from sqlalchemy.orm import Session

from app.models import FavoriteCoin
from app.schemas.favorite import Favorite



@pytest.fixture
def create_favorite_oficial(session: Session) -> Favorite:
    currency = Favorite(
        currency_code="BRL",
        currency_type="oficial")

    currency_db = FavoriteCoin(**currency.dict())
    session.add(currency_db)
    session.commit()
    return currency


@pytest.fixture
def create_favorite_fantasy(session: Session, create_hurb_quote) -> Favorite:
    currency = Favorite(
        currency_code="HURB",
        currency_type="fantasy")

    currency_db = FavoriteCoin(**currency.dict())
    session.add(currency_db)
    session.commit()
    return currency