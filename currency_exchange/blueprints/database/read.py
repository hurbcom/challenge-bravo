from currency_exchange.models.Currency import ExchangeRate, db


def reading_all_symbols_from_table_exchange_rate() -> list:
    """
    With this method you can read all the currencies from the database.

    :return: A list with all currencies find in database.
    """
    symbols = []

    informations = db.session.query(ExchangeRate).all()

    for information in informations:
        symbols.append(information)

    return symbols


def reading_specific_symbol_from_table_exchange_rate(information: str) -> object:
    """
    With this method you will read all the information about the specific currency from the database.

    :return: It will return a object contain all information about selected currency.
    """
    select_information = ExchangeRate.query.filter_by(symbol=information).first()
    return select_information
