from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.currencies import (
    CurrencyInput,
    CurrencyOutput,
    CurrencyResponse,
    MultipleCurrencyResponse,
)
from app.services.currencies import CurrencyService

router = APIRouter(prefix="/currencies", tags=["Currencies"])


@router.get(
    "/", status_code=status.HTTP_200_OK, response_model=MultipleCurrencyResponse
)
def read_all_currencies(db: Session = Depends(get_db)):
    currency = CurrencyService()
    currency_list = currency.read_all(db=db)
    return MultipleCurrencyResponse(data=currency_list)


@router.get(
    "/{currency_code}", status_code=status.HTTP_200_OK, response_model=CurrencyResponse
)
def read_currency(currency_code: str, db: Session = Depends(get_db)):
    currency = CurrencyService(currency_code=currency_code)
    currency_db = currency.read(db=db)
    currency_output = CurrencyOutput(**currency_db.dict())
    return CurrencyResponse(data=currency_output)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=CurrencyResponse)
def create_currency(currency_data: CurrencyInput, db: Session = Depends(get_db)):
    currency = CurrencyService(**currency_data.dict(exclude_none=True))
    currency_db = currency.create(db=db)
    currency_output = CurrencyOutput(**currency_db.dict())
    return CurrencyResponse(data=currency_output)


@router.put(
    "/{currency_code}", status_code=status.HTTP_200_OK, response_model=CurrencyResponse
)
def update_currency(
    currency_code: str, currency_data: CurrencyInput, db: Session = Depends(get_db)
):
    currency = CurrencyService(**currency_data.dict(exclude_none=True))
    currency_db = currency.update(db=db, original_currency_code=currency_code)
    currency_output = CurrencyOutput(**currency_db.dict())
    return CurrencyResponse(data=currency_output)


@router.delete("/{currency_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_currency(currency_code: str, db: Session = Depends(get_db)):
    currency = CurrencyService(currency_code=currency_code)
    return currency.delete(db=db)