from coin.repository.CoinRepository import CoinRepository
from decimal import Decimal

class ConvertService:

    def __init__(self):
        self._coin_repository = CoinRepository()

    def convert(self, params):
        amount = params['amount']
        if params['to'] == 'USD':
            coin_from = self._coin_repository.list_for_initials(coin_initials=params['from'])
            return float(amount) * coin_from.price
        coin_from = self._coin_repository.list_for_initials(coin_initials=params['from'])
        coin_to = self._coin_repository.list_for_initials(coin_initials=params['to'])
        to_dollar = Decimal(amount) * Decimal(coin_from.price)
        to_final = Decimal(to_dollar) / Decimal(coin_to.price)
        return to_final
