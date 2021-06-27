from coin.model.CoinModel import CoinModel

class CoinRepository:

    def create(self, params):
        res = CoinModel.objects.create(**params)
        return res

    def list(self, params=None):
        query = CoinModel.objects.all()
        return query

    def update(self, params=None, coin=None):
        query = CoinModel.objects.filter(coin=coin).update(**params)
        return query

    def update_for_coin(self, params=None, coin=None):
        query = CoinModel.objects.filter(coin=coin).update(**params)
        return query

    def list_for_pk(self, pk):
        query = CoinModel.objects.get(pk=pk)
        return query

    def list_for_coin(self, coin):
        query = CoinModel.objects.get(coin=coin)
        return query

    def filter_for_coin(self, coin):
        query = CoinModel.objects.filter(coin=coin)
        return query

    def list_for_initials(self, coin_initials):
        query = CoinModel.objects.get(coin_initials=coin_initials)
        return query

    def delete(self, coin: str) -> bool:
        query = CoinModel.objects.get(coin_initials=coin)
        query.delete()
        return True