from currency_exchange.blueprints.database.read import reading_all_symbols_from_table_exchange_rate, \
    reading_specific_symbol_from_table_exchange_rate
from currency_exchange.blueprints.database.save import update_available_table_exchange_rate, \
    saving_table_exchange_rate
from currency_exchange.blueprints.scrapping.publicAPI import update_specific_currency
from currency_exchange.blueprints.return_message.json_return_with_code import custom_error, sucessfully


def get_creating_and_deleting_currencies() -> dict:
    """
    This method is responsible for the GET in the URL (/currencies),
    it will return all available currencies in the database.

    :return: A Json with parameters necessary and the status code of page.
    """

    single_currencie = {}
    currencies = {}

    # Get all currencies from database to return
    for c in reading_all_symbols_from_table_exchange_rate():
        # If the currency is available, it will add in Json
        if c.available:
            update_specific_currency(currency=c.symbol)
            single_currencie = {
                c.symbol: {
                    "rate": c.rate,
                }
            }

        currencies.update(single_currencie)

    return sucessfully(currencies, 200)


def post_creating_and_deleting_currencies(request_data: dict) -> dict:
    """
    This method is responsible for POST to the URL (/currencies). This method is responsible for
    creating the new currency and also for checks before adding it to the database.

    :return: It return a JSON with status code.
    """

    if ("rate" and not "symbol") or ("symbol" and not "rate") in request_data.keys():
        data = {"error": f"symbol not available."}
        return custom_error(data, 404)

    if 'available' in request_data:
        if 'symbol' in request_data:
            if reading_specific_symbol_from_table_exchange_rate(request_data["symbol"]):
                update_available_table_exchange_rate(
                    currency=request_data['symbol'], available=request_data["available"]
                )

            else:
                data = {"error": f"{request_data['symbol']} is not available"}
                return custom_error(data, 404)

            data = {'sucessfully':
                        f"the {request_data['symbol']} was modified to {'Available' if request_data['available'] is True else 'Unavailable'}"}
            return sucessfully(data, 200)

        data = {'error': 'please, insert the symbol'}
        return custom_error(data, 409)

    # if user dont give the symbol and rate information, it doesnt continue.
    # User need to set a rate from 1 USD value.
    if ('symbol' and 'rate') not in request_data:
        data = {'error': 'please, add a symbol and the rate to add the currency.'}
        return custom_error(data, 409)

    symbol = str(request_data['symbol']).upper() or None
    rate = request_data['rate']
    symbol_information = reading_specific_symbol_from_table_exchange_rate(symbol)

    # if the symbol in database and if is available to consulting:
    if symbol_information and symbol_information.available == True:
        data = {'error': 'currency available, please add another currency.'}
        return custom_error(data, 409)

    # Adding a new currency to database. Thats necessary to add the rate 1 from USD and the symbol.
    saving_table_exchange_rate(currency=symbol, price_information=rate)
    new_currency = reading_specific_symbol_from_table_exchange_rate(symbol)
    data = {
        'information': 'sucessfully added',
        'currency_name': symbol,
        'rate': rate,
        'last_update': new_currency.last_update
    }

    return sucessfully(data, 201)


def delete_creating_and_deleting_currencies(request_data: dict) -> dict:
    """
    This method is responsible for the DELETE method in the URL (/currencies).
    This method disables a coin. By default no one currency is deleted from the database,
    it is just disabled to have a history available.

    :return: It return a dict with status code
    """

    # Check if the param "symbol" was sent in body.
    if 'symbol' not in request_data:
        data = {'error': 'please, add a symbol to delete the currency'}
        return custom_error(data, 409)

    symbol = str(request_data['symbol']).upper()

    # Check if the symbol is storaged in database and if its not available.
    database_symbol = reading_specific_symbol_from_table_exchange_rate(symbol)
    if not bool(database_symbol) or database_symbol.available is False:
        data = {"error": f"{symbol} is not on our database."}
        return custom_error(data, 404)

    # Getting the symbol and inserting in database
    update_available_table_exchange_rate(currency=symbol, available=False)

    data = {'sucess': f"the {symbol} was deleted"}
    return sucessfully(data, 200)
