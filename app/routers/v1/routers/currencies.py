from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from app import dependencies

router = APIRouter(
    prefix="/currencies",
    tags=["currencies"]
)

fake_items_db = {"plumbus": {"name": "Plumbus"}, "gun": {"name": "Portal Gun"}}


@router.get("/")
async def read_currencies(db: Session = Depends(dependencies.get_db)):
    return fake_items_db


@router.get("/convert")
async def exchange(currency_from: str, to: str, amount: int):
    return {"from": currency_from, "to": to, "amount": amount}
