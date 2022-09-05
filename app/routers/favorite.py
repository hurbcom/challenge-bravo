from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.operators.currency import CurrencyOperator
from app.schemas.currency import CurrencyOut, CurrencyResponse, MultipleCurrencyResponse
from app.schemas.favorite import FavoriteResponse



router = APIRouter(
    prefix="/favorite",
    tags=["favorite"]
)

@router.get("/", status_code=status.HTTP_200_OK, response_model=MultipleCurrencyResponse)
def read_all_favorites(db: Session = Depends(get_db)):
    """ Returns all currencies from `favorite_coins` table """

    currency = CurrencyOperator()
    currency_list = currency.read_all_favorites(db=db)
    return MultipleCurrencyResponse(data=currency_list)


@router.get("/{currency_code}", status_code=status.HTTP_200_OK, response_model=CurrencyResponse)
def read_favorite(currency_code: str, db: Session = Depends(get_db)):
    """ Returns a specific currency from `favorite_coins` table """

    currency = CurrencyOperator(currency_code=currency_code)
    currency_db = currency.read_favorite(db=db)
    currency_output = CurrencyOut(**currency_db.dict())
    return CurrencyResponse(data=currency_output)


@router.post("/{currency_code}", status_code=status.HTTP_201_CREATED, response_model=FavoriteResponse)
def add_favorite(currency_code: str, db: Session = Depends(get_db)):
    """ Add currency from `favorite_coins` table if found in `oficial_coins` or `fantasy_coins` tables """

    currency = CurrencyOperator(currency_code=currency_code)
    currency_db = currency.favorite(db=db)
    return FavoriteResponse(data=currency_db)


@router.delete("/{currency_code}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(currency_code: str, db: Session = Depends(get_db)):
    """ Remove currency from `favorite_coins` table """

    currency = CurrencyOperator(currency_code=currency_code)
    currency.unfavorite(db=db)
    return