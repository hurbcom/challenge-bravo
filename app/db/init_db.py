import requests
from sqlalchemy.orm import Session
from app.models.currency import Currency
import logging

logger = logging.getLogger(__name__)


def init_db(db: Session, api_exchange_url, api_exchange_key) -> None:
    response = requests.get(f"{api_exchange_url}?app_id={api_exchange_key}")
    data = response.json()
    for currency, rate in data["rates"].items():
        db_currency = Currency(code=currency, rate=rate)
        db.add(db_currency)
        db.commit()
        db.refresh(db_currency)
