from typing import List

from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status
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


@router.get("/{code}", response_model=schemas.CurrencyInDB, responses={status.HTTP_404_NOT_FOUND: {
    "description": "Currency Not Found"}})
async def read_currency_by_code(code: str, db: Session = Depends(dependencies.get_db)):
    """
    Fetch currency by code.
    """
    currency = crud.currency.get_by_code(db, code=code.upper())

    if not currency:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Currency not found")

    return currency


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Currency,
             responses=dependencies.responses())
def create_currency(*, currency_in: schemas.CurrencyCreate, db: Session = Depends(dependencies.get_db)) -> dict:
    """
    Create a new currency in the database.
    """

    currency = crud.currency.get_by_code(db=db, code=currency_in.code)

    if currency:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Currency already exists")

    currency_exists = crud.currency.get_by_code(db=db, code=currency_in.code)

    if currency_exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Currency already exists")

    currency = crud.currency.create(db=db, obj_in=currency_in)

    return currency


@router.put("/{id}", response_model=schemas.Currency, responses=dependencies.responses())
def update_currency(*, id: int, currency_in: schemas.CurrencyUpdate, db: Session = Depends(dependencies.get_db)
                    ) -> dict:
    """
    Update a currency in the database.
    """

    currency = crud.currency.get(db, id=id)

    if not currency:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Currency not found")

    currency_exists = crud.currency.get_by_code(db=db, code=currency_in.code)

    if currency_exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Currency already exists")

    currency = crud.currency.update(db=db, obj_in=currency_in, db_obj=currency)

    return currency


@router.get("/convert/")
async def exchange(code_from: str, code_to: str, amount: int, db: Session = Depends(dependencies.get_db)):
    """
    Convert currencies by amount.
    """

    currency_to = crud.currency.get_by_code(db, code=code_to.upper())

    currency_from = crud.currency.get_by_code(db, code=code_from.upper())

    if not currency_to:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Currency {} not found".format(code_to))

    if not currency_from:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Currency {} not found".format(code_from))

    if currency_to.code != "USD":
        rate = round(amount * (currency_to.rate / currency_from.rate), 2)
        return {"from": currency_from, "to": currency_to, "amount": amount, "rate": rate}


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(*, db: Session = Depends(dependencies.get_db), id: int) -> None:
    """
    Delete a currency.
    """
    item = crud.currency.get(db=db, id=id)
    if not item:
        raise HTTPException(status_code=404, detail="Currency not found")

    crud.currency.remove(db=db, id=id)
