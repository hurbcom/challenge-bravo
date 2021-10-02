from currency_exchange.blueprints.database.read import reading_specific_symbol_from_table_exchange_rate
from currency_exchange.blueprints.scrapping.publicAPI import update_specific_currency
from currency_exchange.blueprints.return_message.message_return import custom_error, sucessfully


def converting_currencies_and_return_dict(from_currency, to_currency, amount):
    from_currency_in_database = reading_specific_symbol_from_table_exchange_rate(from_currency)
    to_currency_in_database = reading_specific_symbol_from_table_exchange_rate(to_currency)

    # Verify if both currencies are storaged in database
    if not bool(from_currency_in_database) or not bool(to_currency_in_database):
        if not from_currency_in_database:
            data = {'error': f'currency {from_currency} not available in our database.'}
            return custom_error(data, 404)
        data = {'error': f'currency {to_currency} not available in our database.'}
        return custom_error(data, 404)

    # Verify if the ammount in args to more than 0
    if float(amount) < 0:
        data = {"error": "insert a amount more than 1"}
        return custom_error(data, 409)

    # If the currency is unavailable in database, it return a return_message.
    if not from_currency_in_database.available or not to_currency_in_database.available:
        if not to_currency_in_database.available:
            data = {'error': f'{from_currency_in_database.symbol} not available'}
            return custom_error(data, 404)
        data = {'return_message': f'{to_currency_in_database.symbol} not available'}
        return custom_error(data, 404)

    # from requests import get as request_get
    # json_request = request_get(f"https://api.exchangerate.host/symbols").json()
    # if from_currency and to_currency in json_request["symbols"]:
    #     req = request_get(f"https://api.exchangerate.host/convert?from={from_currency}&to={to_currency}").json()
    #     data = {
    #         'from': from_currency,
    #         'to': to_currency,
    #         'amount': amount.replace(".", ","),
    #         'rate': float(req["info"]["rate"]) * float(amount)
    #     }
    #     return sucessfully(data, 200)

    # Updating both currencies in database
    update_specific_currency(currency=from_currency)
    update_specific_currency(currency=from_currency)

    # The logic to convert all currency starting from USD price.
    conversion = float((float(from_currency_in_database.rate) / float(to_currency_in_database.rate)) * float(amount))

    # Creating a Json to return
    data = {
        'from': from_currency,
        'to': to_currency,
        'amount': amount.replace(".", ","),
        'rate': conversion,
    }

    return sucessfully(data, 200)

