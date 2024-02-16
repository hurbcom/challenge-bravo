def return_amount(from_, to, amount, actual_values: dict) -> str:
    """ """
    currencys_used = f"{from_}{to}"
    highest_value = float(actual_values.get(currencys_used, {}).get("bid"))
    value = highest_value * amount
    return f"{value:.2f}"
