from challenge_bravo.currency_exchange.models.Currency import ExchangeRate, db

from datetime import datetime as d


def saving_table_exchange_rate(currency: str, price_information: float, available: bool = True) -> object:
    time = d.now().strftime("%Y-%m-%d %H:%M:%S")

    # Create database if not exists.
    db.create_all()

    symbol = ExchangeRate.query.filter_by(symbol=currency).first()
    # if the symbol exists in database, it will update with new informations.
    if bool(symbol):
        # if the Currency is USD, it will insert "1" in rate. Because all currencies is based in USD.
        if currency == 'USD':
            update_currency = ExchangeRate.query.get(symbol.id)
            update_currency.rate = "1"
            update_currency.last_update = time
            db.session.commit()
            return update_currency

        update_currency = ExchangeRate.query.get(symbol.id)
        update_currency.rate = price_information
        update_currency.last_update = time
        db.session.commit()
        return update_currency

    # save to database if the symbol dont exists.
    db.session.add(ExchangeRate(
        symbol=str(currency),
        last_update=time,
        rate=price_information,
        available=available,
    ))
    db.session.commit()

    return symbol


def update_available_table_exchange_rate(currency: str, available: bool) -> None:
    # Create database if not exists.
    db.create_all()

    # Getting the symbol and update the available
    symbol = ExchangeRate.query.filter_by(symbol=currency).first()
    update_currency = ExchangeRate.query.get(symbol.id)
    update_currency.available = available
    db.session.commit()