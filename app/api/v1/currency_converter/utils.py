def amount_from_api_response(
    from_: str, to: str, amount: float, actual_values: dict
) -> str:
    """ """
    currencys_used = f"{from_}{to}"
    bid = float(actual_values.get(currencys_used, {}).get("bid"))
    value = bid * amount
    return f"{value:.2f}"


def amount_from_bd_response(from_value: str, to_value: str, amount: float) -> str:
    """ """
    bid = float(from_value / to_value)
    value = bid * amount
    return f"{value:.2f}"
