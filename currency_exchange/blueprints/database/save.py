from currency_exchange.models.Currency import ExchangeRate, db

from datetime import datetime as d


def saving_table_exchange_rate(currency: str, price_information: float, available: bool = True) -> object or None:
    """
    This method will save the information received in table "exchange_rate".

    :return: It will return the same object in case if the symbols exists, or will return None.
    """

    time = d.now().strftime("%Y-%m-%d %H:%M:%S")

    symbol = ExchangeRate.query.filter_by(symbol=currency).first()

    # if the symbol exists in database, it will update with new informations.
    if bool(symbol):
        try:
            update_currency = ExchangeRate.query.get(symbol.id)
            update_currency.rate = price_information
            db.session.commit()
            return update_currency

        except:
            db.session.rollback()

    # save to database if the symbol dont exists.
    try:
        db.session.add(ExchangeRate(
            symbol=str(currency),
            last_update=time,
            rate=price_information,
            available=available,
        ))
        db.session.commit()

    except:
        db.session.rollback()


def update_available_table_exchange_rate(currency: str, available: bool) -> None:
    try:
        # Getting the symbol and update the available
        symbol = ExchangeRate.query.filter_by(symbol=currency).first()
        update_currency = ExchangeRate.query.get(symbol.id)
        update_currency.available = available
        db.session.commit()

    except:
        db.session.rollback()
