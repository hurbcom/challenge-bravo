COINS = ['USD', 'BRL', 'EUR', 'BTC', 'ETH']


def validate_from(value):
    if value in COINS:
        return True
    return False


def validate_to(value):
    if value in COINS:
        return True
    return False


def validate_amount(value):
    try:
        float(value)
        return True
    except:
        return False
