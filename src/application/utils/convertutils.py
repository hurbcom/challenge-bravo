from decimal import Decimal

def calculateExchange(amount, from_, to, quotes):
    ''' Currency rate calculator
    
    '''
    returnAmount = None

    # By design, from is always 'USD', so the inversion
    if to == 'USD':
        returnAmount = Decimal(amount) / Decimal(quotes[to + from_])

    # Simple conversion
    elif from_ == 'USD':
        returnAmount = Decimal(amount) * Decimal(quotes[from_ + to])

    # Proportion
    else:
        fromQuote = quotes['USD' + from_]
        toQuote = quotes['USD' + to]

        returnAmount = Decimal(amount) * (Decimal(toQuote) / Decimal(fromQuote))

    # 6 decimal places
    SIXPLACES = Decimal(10) ** -6

    return returnAmount.quantize(SIXPLACES)