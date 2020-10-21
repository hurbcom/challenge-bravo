from converter.models import Currency
from django.db.models import Q



def conversion_calculate(amount, quotation):
    return amount * quotation


def verify_if_exists_symbols(symbol_from, symbol_to):
    currency_qs = Currency.objects.filter(Q(symbol=symbol_to) | Q(symbol=symbol_from))    
    if not currency_qs.count() == 2:
        return False
    return True