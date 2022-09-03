from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.operators.currency import CurrencyOperator
from app.schemas import CurrencyOut, CurrencyResponse, MultipleCurrencyResponse



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


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_quote():
    """ Create new quote in `fantasy_coins` table """
    pass


@router.put("/{currency_code}", status_code=status.HTTP_200_OK)
def update_quote(currency_code: str):
    """ Updates existing quote in `fantasy_coins` """
    pass


@router.delete("/{currency_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quote(currency_code: str):
    """ Deletes existing quote in `fantasy_coins` table """
    pass