from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.operators.currency import CurrencyOperator
from app.schemas.currency import CurrencyDatabase, CurrencyInput, CurrencyOut, CurrencyResponse, MultipleCurrencyResponse



router = APIRouter(
    prefix="/quote",
    tags=["quote"]
)


@router.get("/", status_code=status.HTTP_200_OK, response_model=MultipleCurrencyResponse)
def read_all_quotes(db: Session = Depends(get_db)):
    """ Return all currencies in both oficial and fantasy tables """

    currency = CurrencyOperator()
    currency_list = currency.read_all(db=db)
    return MultipleCurrencyResponse(data=currency_list)


@router.get("/{currency_code}", status_code=status.HTTP_200_OK, response_model=CurrencyResponse)
def read_quote(currency_code: str, db: Session = Depends(get_db)):
    """ Return one specific currency information """

    currency = CurrencyOperator(currency_code=currency_code)
    currency_db = currency.read(db=db)
    currency_output = CurrencyOut(**currency_db.dict())
    return CurrencyResponse(data=currency_output)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=CurrencyResponse)
def create_quote(currency_data: CurrencyInput, db: Session = Depends(get_db)):
    """ Create new quote in `fantasy_coins` table """

    currency = CurrencyOperator(**currency_data.dict(exclude_none=True))
    currency_db = currency.create(db=db)
    currency_output = CurrencyOut(**currency_db.dict())
    return CurrencyResponse(data=currency_output)


@router.put("/{currency_code}", status_code=status.HTTP_200_OK, response_model=CurrencyResponse)
def update_quote(currency_code: str, currency_data: CurrencyInput, db: Session = Depends(get_db)):
    """ Updates existing quote in `fantasy_coins` """

    currency = CurrencyOperator(**currency_data.dict(exclude_none=True))
    currency_db = currency.update(db=db, original_currency_code=currency_code)
    currency_output = CurrencyOut(**currency_db.dict())
    return CurrencyResponse(data=currency_output)


@router.delete("/{currency_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quote(currency_code: str, db: Session = Depends(get_db)):
    """ Deletes existing quote from `fantasy_coins` table """

    currency = CurrencyOperator(currency_code=currency_code)
    return currency.delete(db=db)