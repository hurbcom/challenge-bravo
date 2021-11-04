from sqlalchemy.orm import Session

from app import crud
from app.schemas.currency import CurrencyCreate, CurrencyUpdate


def test_create_currency(db: Session) -> None:
    code = 'TST'
    rate = 1
    currency_in = CurrencyCreate(code=code, rate=rate)
    currency = crud.currency.create(db=db, obj_in=currency_in)
    assert currency.code == code
    assert currency.rate == rate


def test_get_currency(db: Session) -> None:
    code = 'TST2'
    rate = 1
    currency_in = CurrencyCreate(code=code, rate=rate)
    currency = crud.currency.create(db=db, obj_in=currency_in)
    stored_currency = crud.currency.get(db=db, id=currency.id)
    assert stored_currency
    assert currency.id == stored_currency.id
    assert currency.code == stored_currency.code
    assert currency.rate == stored_currency.rate


def test_get_currency_by_code(db: Session) -> None:
    code = 'TST3'
    rate = 1
    currency_in = CurrencyCreate(code=code, rate=rate)
    currency = crud.currency.create(db=db, obj_in=currency_in)
    stored_currency = crud.currency.get_by_code(db=db, code=code)
    assert stored_currency
    assert currency.code == stored_currency.code
    assert currency.rate == stored_currency.rate


def test_update_item(db: Session) -> None:
    code = 'TST'
    rate = 1
    currency_in = CurrencyCreate(code=code, rate=rate)
    currency = crud.currency.create(db=db, obj_in=currency_in)
    rate2 = 2
    currency_update = CurrencyUpdate(rate=rate2)
    currency2 = crud.currency.update(db=db, db_obj=currency, obj_in=currency_update)
    assert currency.id == currency2.id
    assert currency.code == currency2.code
    assert currency2.rate == rate2


def test_delete_currency(db: Session) -> None:
    code = 'TST'
    rate = 1
    currency_in = CurrencyCreate(code=code, rate=rate)
    currency = crud.currency.create(db=db, obj_in=currency_in)

    crud.currency.remove(db=db, id=currency.id)
    currency3 = crud.currency.get(db=db, id=currency.id)
    assert currency3 is None
