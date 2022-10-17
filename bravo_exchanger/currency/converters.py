from currency.external_provider.coinbase_api import get_quote


def get_currency_conversion_data(amount: float, currency_from: dict, currency_to: dict) -> float:
    """Get currency conversion data.

    Args:
        amount (float): amount to be converted
        currency_from (dict): source currency data
        currency_to (dict): destination currency data

    Returns:
        A float referring to the value of the currency already converted.
    """
    if currency_from['currency_backing'] == currency_to['currency_backing']:
        return (currency_from['currency_amount'] * amount) / currency_to['currency_amount']

    if not currency_from['is_fictional'] and not currency_to['is_fictional']:
        currency_quote = get_quote(
            currency_from['currency_backing'], currency_to['currency_backing']
        )

        return currency_quote * amount

    currency_quote = get_quote(currency_from['currency_backing'], currency_to['currency_backing'])

    total_currency_value = currency_from['currency_amount'] * currency_quote

    return (total_currency_value * amount) / currency_to['currency_amount']
