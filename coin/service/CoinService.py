from rest_framework.exceptions import APIException
from coin.api.CoinSerializer import CoinSerializer
from coin.model.CoinModel import CoinModel
from coin.repository.CoinRepository import CoinRepository
from core.service.PaginatorService import PaginatorService

class CoinService(PaginatorService):

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
        return True

    def list(self, param):
        query = self._coin_repository.list()
        pages = self.paginar(query, CoinSerializer, param)
        return pages

    def update_for_pk(self, params, pk) -> bool:
        coin = self._coin_repository.get_for_pk(pk)
        try:
            serializer = CoinSerializer(coin, data=params.data)
            serializer.is_valid(raise_exception=True)
            res = self._coin_repository.update_for_pk(params.data, pk)
            return True
        except Exception as e:
            raise APIException('Erro ao atualizar')

    def update_all_coin(self, params) -> bool:
        try:
            for r in params.data:
                coin = self._coin_repository.list_for_coin(r['coin'])
                serializer = CoinSerializer(coin, data=r)
                serializer.is_valid(raise_exception=True)
                res = self._coin_repository.update_all_coin(r, r['coin'])
            return True
        except Exception as error:
            raise APIException(error)

    def delete(self, pk) -> bool:
        res = self._coin_repository.delete(pk)
        return True

    def get_for_bslt(self, param: str) -> CoinModel:
        res = self._coin_repository.get_for_bstl(param)
        return res