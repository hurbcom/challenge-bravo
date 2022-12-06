import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine, get_db
from app.main import app
from app.models import CurrenciesCoinsbaseModel, CreatedCoinsModel
from app.models import CurrenciesCoinsbaseModel, CreatedCoinsModel
from app.schemas.currencies import Currency

CURRENCY_VALUES_TEST_DATA = {
    "data": {
        "currency": "USD",
        "rates": {
            "BRL": "5.12",
            "EUR": "1.01",
            "USD": "1.0",
            "BTC": "0.00005",
            "ETH": "0.0006",
        },
    }
}

@pytest.fixture
def real_currency_data_brl() -> dict:
    return {"currency_code": "BRL", "backed_by": "USD", "rate": 5.59}


@pytest.fixture
def created_currency_data_test() -> dict:
    return {"currency_code": "TEST", "backed_by": "USD", "rate": 5.59}


@pytest.fixture
def created_currency_data_hurb_alternative_input() -> dict:
    return {
        "currency_code": "HURB",
        "backed_by": "BRL",
        "amount": 12.0,
        "backed_currency_amount": 3.0,
    }


@pytest.fixture
def created_currency_data_hurb_missing_field_input() -> dict:
    return {"currency_code": "HURB", "backed_by": "BRL", "amount": 12.0}


@pytest.fixture
def created_currency_data_hurb_all_fields_input() -> dict:
    return {
        "currency_code": "HURB",
        "backed_by": "BRL",
        "rate": 4.0,
        "amount": 12.0,
        "backed_currency_amount": 3.0,
    }

client = TestClient(app)

@pytest.fixture
def session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def insert_test_data(session: Session):
    db = SessionLocal()

    response = CURRENCY_VALUES_TEST_DATA
    currencies = response["data"]["rates"]
    for currency_code, rate in currencies.items():
        currency = Currency(currency_code=currency_code, rate=rate)
        currency_db = CurrenciesCoinsbaseModel(
            currency_code=currency.currency_code, rate=currency.rate
        )
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

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)


@pytest.fixture
def coinbase_currencies_public_api_dummy_data() -> dict:
    return {"currency_code": "BRL"}


@pytest.fixture
def created_dummy_data() -> dict:
    return {"currency_code": "HURB"}


@pytest.fixture
def created_currency_data_hurb() -> dict:
    return {"currency_code": "HURB", "rate": 4.0, "backed_by": "BRL"}


@pytest.fixture
def created_currency_data_test():
    return {"currency_code": "TEST", "rate": 0.4, "backed_by": "BRL"}


@pytest.fixture
def create_hurb_currency(
    client: TestClient, session: Session, created_currency_data_hurb: dict
) -> dict:
    currency_db = CreatedCoinsModel(**created_currency_data_hurb)
    session.add(currency_db)
    session.commit()
    return created_currency_data_hurb


@pytest.fixture
def create_test_currency(
    client: TestClient, session: Session, created_currency_data_test: dict
) -> dict:
    currency_db = CreatedCoinsModel(**created_currency_data_test)
    session.add(currency_db)
    session.commit()
    return created_currency_data_test