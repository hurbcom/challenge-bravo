from challenge_bravo.currency_exchange.blueprints.database.read import reading_all_symbols_from_table_exchange_rate
from challenge_bravo.currency_exchange.blueprints.utils.apiRequest import parsing_api
from challenge_bravo.currency_exchange.blueprints.database.save import saving_table_exchange_rate


def default_currencies():
    currencies = (
        "USD", "BRL", "EUR", "BTC", "ETH",
    )

    for currency in currencies:
        try:
            soup = parsing_api(url=f"https://api.exchangerate.host/convert?from={currency}&to=USD")
            rate_currency = soup["info"]["rate"]
            from_currency = soup["query"]["from"]
            saving_table_exchange_rate(currency=from_currency, price_information=rate_currency)

        except Exception as e:
            print(e)


def update_specific_currency(currency):
    try:
        soup = parsing_api(url=f"https://api.exchangerate.host/convert?from={currency}&to=USD")
        rate_currency = soup["info"]["rate"]
        from_currency = soup["query"]["from"]
        saving_table_exchange_rate(currency=from_currency, price_information=rate_currency)
    except Exception as e:
        print(e)


def update_all_currencies_from_database():
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

    except Exception as e:
        print(e)