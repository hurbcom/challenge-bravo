from coin.model.CoinModel import CoinModel
from coin.repository.CoinRepository import CoinRepository
from decimal import Decimal


class ConvertService:

    def __init__(self):
        self._coin_repository = CoinRepository()

    def _to_dollar(self, param: str):
        res: CoinModel
        res = self._coin_repository.list_for_initials(param)

        while res.bslt != 'USD':
            res = self._coin_repository.list_for_initials(param)

        return res

    def convert(self, params: dict) -> dict:

        if Decimal(params['amount']) < 0:
            return {
                'msg': 'Valor não pode ser convertido'
            }

        amount = params['amount']
        coin_from = self._coin_repository.list_for_initials(coin_initials=params['from'])
        coin_to = self._coin_repository.list_for_initials(coin_initials=params['to'])

        if coin_from.amount_coint_bslt == 1 and coin_to.amount_coint_bslt == 1 and coin_from.bslt == coin_to.bslt:
            coin_from_prince = Decimal(coin_from.price) / Decimal(coin_from.amount_coint_bslt)
            coin_to_price = Decimal(coin_to.price) / Decimal(coin_from.amount_coint_bslt)
            to_bslt = Decimal(amount) / Decimal(coin_from_prince)
            to_final = Decimal(to_bslt) * Decimal(coin_to_price)

            return {
                'from': coin_from.coin,
                'to': coin_to.coin,
                'final': to_final,
                'msg': 'success'
            }

        if coin_from.bslt == coin_to.coin_initials:
            coin_from_prince = Decimal(coin_from.price) / Decimal(coin_from.amount_coint_bslt)
            to_final = Decimal(amount) * Decimal(coin_from_prince)
            return {
                'from': coin_from.coin,
                'to': coin_to.coin,
                'final': to_final,
                'msg': 'success'
            }

        if coin_from.coin_initials == coin_to.bslt:
            coin_to_price = Decimal(amount) / Decimal(coin_to.price)
            return {
                'from': coin_from.coin,
                'to': coin_to.coin,
                'final': coin_to_price,
                'msg': 'success'
            }

        return {
            'from': coin_from.coin,
            'to': coin_to.coin,
            'msg': 'Não é possível converter'
        }
