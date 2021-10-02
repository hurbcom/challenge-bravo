from challenge_bravo.currency_exchange.blueprints.database.read import reading_all_symbols_from_table_exchange_rate, \
    reading_specific_symbol_from_table_exchange_rate
from challenge_bravo.currency_exchange.blueprints.database.save import update_available_table_exchange_rate, \
    saving_table_exchange_rate
from challenge_bravo.currency_exchange.blueprints.scrapping.publicAPI import default_currencies
from challenge_bravo.currency_exchange.blueprints.scrapping.publicAPI import update_specific_currency
from challenge_bravo.currency_exchange.blueprints.return_message.message_return import custom_error, sucessfully


def get_creating_and_deleting_currencies():
    # If database is empty, add the default currencies
    if not bool(reading_all_symbols_from_table_exchange_rate()):
        default_currencies()

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
                    "last_update": c.last_update,
                }
            }

        currencies.update(single_currencie)

    return sucessfully(currencies, 200)


def post_creating_and_deleting_currencies(request_data):
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

    symbol = str(request_data['symbol']).upper()
    rate = request_data['rate']
    symbol_information = reading_specific_symbol_from_table_exchange_rate(symbol)
    default_currencies()

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


def delete_creating_and_deleting_currencies(request_data):
    # if database is empty, add the default currencies
    if not bool(reading_all_symbols_from_table_exchange_rate()):
        default_currencies()

    # Check if the param "symbol" was sent in body.
    if 'symbol' not in request_data:
        data = {'error': 'please, add a symbol to delete the currency'}
        return custom_error(data, 409)

    # Check if the symbol is storaged in database and if its not available.
    database_symbol = reading_specific_symbol_from_table_exchange_rate(request_data['symbol'])
    if not bool(database_symbol) or database_symbol.available is False:
        data = {"error": f"{request_data['symbol']} is not on our database."}
        return custom_error(data, 404)

    # Getting the symbol and inserting in database
    currency = request_data['symbol']
    update_available_table_exchange_rate(currency=currency, available=False)

    return {'sucess': f"the {currency} was deleted"}