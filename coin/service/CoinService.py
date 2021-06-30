from coin.api.CoinSerializer import CoinSerializer
from coin.model.CoinModel import CoinModel
from coin.repository.CoinRepository import CoinRepository

class CoinService:

    def __init__(self):
        self._coin_repository = CoinRepository()

    def create(self, params):
        for r in params.data:
            is_exist = self._coin_repository.filter_for_coin(r['coin'])
            if len(is_exist) > 0:
                continue
            serializer = CoinSerializer(data=r, many=False)
            serializer.is_valid(raise_exception=True)
            res = self._coin_repository.create(serializer.data)

        return params.data

    def list(self, params):
        query = self._coin_repository.list()
        serializer = CoinSerializer(query, many=True)
        return serializer.data

    def update(self, params, pk) -> bool:
        coin = self._coin_repository.list_for_coin(params.data['coin'])
        serializer = CoinSerializer(coin, data=params.data)
        serializer.is_valid(raise_exception=True)
        res = self._coin_repository.update(params.data, params.data['coin'])
        return True

    def update_coin(self, params) -> bool:
        for r in params.data:
            coin = self._coin_repository.list_for_coin(r['coin'])
            serializer = CoinSerializer(coin, data=r)
            serializer.is_valid(raise_exception=True)
            res = self._coin_repository.update_for_coin(r, r['coin'])
        return True

    def delete(self, coin: str) -> bool:
        res = self._coin_repository.delete(coin)
        return True

    def get_for_bslt(self, param: str) -> CoinModel:
        res = self._coin_repository.get_for_bstl(param)
        return res