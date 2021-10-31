from typing import List

from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from app import dependencies
from app import crud, schemas

router = APIRouter(
    prefix="/currencies",
    tags=["currencies"]
)


@router.get("/", response_model=List[schemas.CurrencyInDB])
async def read_currencies(db: Session = Depends(dependencies.get_db), skip: int = 0, limit: int = 100):
    """
    Retrieve all currencies on database.
    """
    return crud.currency.get_multi(db, skip=skip, limit=limit)


@router.get("/{code}", response_model=schemas.CurrencyInDB, responses={404: {"description": "Currency Not Found"}})
async def read_currency_by_code(code: str, db: Session = Depends(dependencies.get_db)):
    """
    Fetch currency by code.
    """
    currency = crud.currency.get_by_code(db, code=code)

    if not currency:
        raise HTTPException(status_code=404, detail="Currency not found")

    return currency


@router.post("/currency", status_code=201, response_model=schemas.Currency)
def create_recipe(*, recipe_in: schemas.CurrencyCreate, db: Session = Depends(dependencies.get_db)) -> dict:
    """
    Create a new currency in the database.
    """
    recipe = crud.currency.create(db=db, obj_in=recipe_in)

    return recipe


@router.get("/convert/")
async def exchange(code_from: str, code_to: str, amount: int, db: Session = Depends(dependencies.get_db)):
    """
    Convert currencies by amount.
    """

    currency_to = crud.currency.get_by_code(db, code=code_to)

    currency_from = crud.currency.get_by_code(db, code=code_from)

    if not currency_to:
        raise HTTPException(status_code=404, detail="Currenci {} not found".format(code_to))

    if not currency_from:
        raise HTTPException(status_code=404, detail="Currency {} not found".format(code_from))

    if currency_to.code != "USD":
        rate = round(amount * (currency_to.rate / currency_from.rate), 2)
        return {"from": currency_from, "to": currency_to, "amount": amount, "rate": rate}

