from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import pytest

from app.main import app
from app.database import Base, get_db, SessionLocal, engine
from app.models import OficialCoin, FantasyCoin, FavoriteCoin
from app.schemas.currency import Currency
from app.schemas.favorite import Favorite


client = TestClient(app)


# Dummy data for testing purposes
test_data = {
    "data": {
        "currency": "USD",
        "rates": {
            "BRL": "5.12",
            "EUR": "1.01",
            "USD": "1.0",
            "BTC": "0.00005",
            "ETH": "0.0006"
        }
    }
}


# Establishing database connection
@pytest.fixture
def session():
    # Reset database from previous test result
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def insert_test_data(session: Session):
    """ Updates `OficialCoins` table with test data rates"""
    db = SessionLocal()

    res = test_data
    currencies = res['data']['rates']
    for currency_code, rate in currencies.items():
        currency = Currency(currency_code=currency_code, rate=rate)
        currency_db = OficialCoin(currency_code=currency.currency_code, rate=currency.rate)
        db.add(currency_db)
    db.commit()
    db.close()

@pytest.fixture
def client(session: Session, insert_test_data):
    def override_get_db():
        try:
            yield session
        finally:
            session.close()
    # Change get_db dependency to override_get_db in order to manipulate test database
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)

@pytest.fixture
def oficial_dummy_data() -> dict:
    data = {
        "currency_code":"BRL"
    }
    return data

@pytest.fixture
def fantasy_dummy_data() -> dict:
    data = {
        "currency_code":"HURB"
    }
    return data

@pytest.fixture
def fantasy_currency_data_hurb() -> dict:
    payload = {
        "currency_code": "HURB",
        "rate": 4.0,
        "backed_by": "BRL"
    }
    return payload

@pytest.fixture
def fantasy_currency_data_test():
    payload = {
        "currency_code": "TEST",
        "rate": 0.4,
        "backed_by": "BRL"
    }
    return payload

@pytest.fixture
def create_hurb_quote(client: TestClient, session: Session, fantasy_currency_data_hurb: dict) -> dict:
    currency_db = FantasyCoin(**fantasy_currency_data_hurb)
    session.add(currency_db)
    session.commit()
    return fantasy_currency_data_hurb

@pytest.fixture
def create_test_quote(client: TestClient, session: Session, fantasy_currency_data_test: dict) -> dict:
    currency_db = FantasyCoin(**fantasy_currency_data_test)
    session.add(currency_db)
    session.commit()
    return fantasy_currency_data_test

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