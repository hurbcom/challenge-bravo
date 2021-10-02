from currency_exchange.blueprints.database.read import reading_specific_symbol_from_table_exchange_rate
from currency_exchange.blueprints.scrapping.publicAPI import update_specific_currency
from currency_exchange.blueprints.return_message.json_return_with_code import custom_error, sucessfully


def converting_currencies_and_return_dict(from_currency: str, to_currency: str, amount: str) -> object:
    """
    This method will receive the parameters and will convert the currencies and return a object to be sent in API.
    The method will verify if both symbols exists in database and check the amount sent in body of POST,
    after this, it will check if both currencies are available in datbaase to be converted. If all conditions,
    it will update the currencies in database and do the logic to convert all currencies based on USD.

    :from_currency: Must be a string with the currency to convert.
    :to_currency: Must be a string with the currency to be converted.
    :amount: This paramenter must be a string and will be converted to float to do the logic of conversion.
    :return: It will return a object with dict and status code.
    """
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

