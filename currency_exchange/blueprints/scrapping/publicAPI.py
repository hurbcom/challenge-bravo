from currency_exchange.blueprints.database.read import reading_all_symbols_from_table_exchange_rate
from currency_exchange.blueprints.utils.apiRequest import parsing_api
from currency_exchange.blueprints.database.save import saving_table_exchange_rate
from currency_exchange.models.Currency import db


def default_currencies() -> None:
    """
    This method is only to create the database and insert the default currencies on it.

    :return: It return None, only save in database the default currencies.
    """
    db.create_all()
    currencies = (
        "USD", "BRL", "EUR", "BTC",
    )

    for currency in currencies:
        try:
            soup = parsing_api(url=f"https://api.exchangerate.host/convert?from={currency}&to=USD")
            rate_currency = soup["info"]["rate"]
            from_currency = soup["query"]["from"]
            saving_table_exchange_rate(currency=from_currency, price_information=rate_currency)

        except:
            raise Exception


def update_specific_currency(currency: str) -> None:
    """
    This method will update the specific currency received in method.
    This method will ever update the currency based on USD, because of this only receive one parameter.

    :currency: It must be a string and is necessary to send it to URL
    :return: It will return None.
    """

    try:
        req = parsing_api(url=f"https://api.exchangerate.host/convert?from={currency}&to=USD")
        rate_currency = req["info"]["rate"]
        from_currency = req["query"]["from"]
        saving_table_exchange_rate(currency=from_currency, price_information=rate_currency)

    except:
        raise Exception


def update_all_currencies_from_database() -> None:
    """
    This method will update all currencies in database. To update the currency must be enable in database.
    Depending on the amount of available coins this method can be very slow and take a few seconds to run, use it sparingly

    :return: It return None.
    """
    currencies = []
    try:
        for c in reading_all_symbols_from_table_exchange_rate():
            if c.available:
                currencies.append(c.symbol)

        for currency in currencies:
            soup = parsing_api(url=f"https://api.exchangerate.host/convert?from={currency}&to=USD")
            rate_currency = soup["info"]["rate"]
            from_currency = soup["query"]["from"]
            saving_table_exchange_rate(currency=from_currency, price_information=rate_currency)

    except:
        raise Exception