from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db

router = APIRouter(prefix="/currencies", tags=["Currencies"])


@router.get(
    "/", status_code=status.HTTP_200_OK
)
def read_all_currencies(db: Session = Depends(get_db)):
    pass


@router.get(
    "/{currency_code}", status_code=status.HTTP_200_OK
)
def read_currency(currency_code: str, db: Session = Depends(get_db)):
    pass


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_currency(db: Session = Depends(get_db)):
    pass


@router.put(
    "/{currency_code}", status_code=status.HTTP_200_OK
)
def update_currency(
    currency_code: str, db: Session = Depends(get_db)
):
    pass


@router.delete("/{currency_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_currency(currency_code: str, db: Session = Depends(get_db)):
    pass