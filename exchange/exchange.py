import locale
from requests import get


def exchange(coin_from, coin_to, coin_amount):
    """
    It takes a coin_from, coin_to and coin_amount as arguments, and returns the exchange value of the
    coin_amount from coin_from to coin_to

    :param coin_from: The coin you want to exchange from
    :param coin_to: The coin you want to convert to
    :param coin_amount: The amount of the coin you want to exchange
    :return: the value of the exchange.
    """
    base_url = "https://economia.awesomeapi.com.br/last"
    r = get(f"{base_url}/{coin_from}-{coin_to}")
    data = r.json()

    if "message" in data.keys():
        return data["message"]

    code = data.get(next(iter(data)), {}).get("code")
    bid = data.get(next(iter(data)), {}).get("bid")

    if code in ["BTC", "ETH"]:
        bid_converted = bid.replace(".", "")
        bid_converted = int(bid_converted[:4])
    else:
        bid_converted = float(bid)

    exchange = bid_converted * coin_amount

    locale.setlocale(locale.LC_MONETARY, "en_US.UTF-8")
    return locale.currency(exchange, grouping=True)
