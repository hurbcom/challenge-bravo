from datetime import datetime
from time import strptime

from requests import Response

from app.classes import current_app
from app.models.cotations_model import Cotation


def register_cotation(rate, quote_date):
    session = current_app.db.session

    from_currency = current_app.from_currency
    to_currency = current_app.to_currency

    cotation = Cotation(
        code=f"{from_currency.code}{to_currency.code}",
        rate=rate,
        updated_at=datetime.strptime(quote_date, "%Y-%m-%d %H:%M:%S"),
        from_currency=from_currency,
        to_currency=to_currency,
    )

    session.add(cotation)
    session.commit()
