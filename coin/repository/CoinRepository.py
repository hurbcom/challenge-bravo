from rest_framework.exceptions import APIException

from coin.model.CoinModel import CoinModel

class CoinRepository:

    def create(self, params):
        res = CoinModel.objects.create(**params)
        return res

    def list(self):
        query = CoinModel.objects.all()
        return query

    def update_for_pk(self, params: list, pk: str):
        query = CoinModel.objects.filter(pk=pk).update(**params)
        return query

    def update_all_coin(self, params: list, coin=None):
        query = CoinModel.objects.filter(coin=coin).update(**params)
        return query

    def get_for_pk(self, pk):
        try:
            query = CoinModel.objects.get(pk=pk)
            return query
        except Exception as e:
            raise APIException('Moeda não cadastrada.')


    def list_for_coin(self, coin):
        query = CoinModel.objects.get(coin=coin)
        return query

    def filter_for_coin(self, coin):
        query = CoinModel.objects.filter(coin=coin)
        return query

    def list_for_initials(self, coin_initials):
        query = CoinModel.objects.get(coin_initials=coin_initials)
        return query

    def delete(self, pk) -> bool:
        query = CoinModel.objects.filter(pk=pk)
        if len(query) == 0:
            raise APIException('Moeda não cadastrada.')
        query.delete()
        return True

    def get_for_bstl(self, bstl: str):
        query = CoinModel.objects.get(bslt=bstl)
        return query