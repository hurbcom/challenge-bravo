from currency_exchange.blueprints.database.read \
    import reading_all_symbols_from_table_exchange_rate, reading_specific_symbol_from_table_exchange_rate
from currency_exchange.blueprints.scrapping.publicAPI import default_currencies
from currency_exchange.blueprints.scrapping.publicAPI import update_specific_currency
from currency_exchange.blueprints.return_message.message_return import custom_error, sucessfully


def converting_currencies_and_return_dict(f, t, a):
    # Updating database with default currencies if database empty.
    if not bool(reading_all_symbols_from_table_exchange_rate()):
        default_currencies()

    # Getting the args from URL
    from_currency_arg = f
    to_currency_arg = t
    amount_arg = a

    # Verify if the args are in URL
    if not from_currency_arg or not to_currency_arg:
        data = {"error": "please, verify the URL contains all paraments"}
        return custom_error(data, 409)

    # Verify if both currencies are storaged in database
    if not bool(reading_specific_symbol_from_table_exchange_rate(from_currency_arg)) \
        or not bool(reading_specific_symbol_from_table_exchange_rate(to_currency_arg)):
        if not bool(reading_specific_symbol_from_table_exchange_rate(from_currency_arg)):
            data = {'error': f'currency {from_currency_arg} not available in our database.'}
            return custom_error(data, 404)
        data = {'error': f'currency {to_currency_arg} not available in our database.'}
        return custom_error(data, 404)

    # Verify if the ammount in args to more than 0
    if float(amount_arg) < 0:
        data = {"error": "insert a amount more than 1"}
        return custom_error(data, 409)

    # Updating both currencies in database
    update_specific_currency(currency=from_currency_arg)
    update_specific_currency(currency=to_currency_arg)

    # The logic to convert all currency starting from USD price.
    currency_from = reading_specific_symbol_from_table_exchange_rate(from_currency_arg)
    to_currency = reading_specific_symbol_from_table_exchange_rate(to_currency_arg)
    conversion = float((float(currency_from.rate) / float(to_currency.rate)) * float(amount_arg))

    # If the currency is not available in database, it return a return_message.
    if not currency_from.available or not to_currency.available:
        if not currency_from.available:
            data = {'error': f'{currency_from.symbol} not available'}
            return custom_error(data, 404)
        data = {'return_message': f'{to_currency.symbol} not available'}
        return custom_error(data, 404)

    # Creating a Json to return
    data = {
        'from': currency_from.symbol,
        'to': to_currency.symbol,
        'amount': amount_arg.replace(".", ","),
        'conversion': conversion,
        str(f'{currency_from.symbol}_time_updated').lower(): currency_from.last_update,
        str(f'{to_currency.symbol}_time_updated').lower(): to_currency.last_update
    }

    return sucessfully(data, 200)

