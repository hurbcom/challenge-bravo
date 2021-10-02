from currency_exchange.models.Currency import ExchangeRate, db


def reading_all_symbols_from_table_exchange_rate() -> list:
    symbols = []

    informations = db.session.query(ExchangeRate).all()

    for information in informations:
        symbols.append(information)

    return symbols


def reading_specific_symbol_from_table_exchange_rate(information: str):
    select_information = ExchangeRate.query.filter_by(symbol=information).first()
    return select_information
