from server.config import Config
import models
import time, threading

class CacheListUpdater(threading.Thread):
    def __init__(self, shared, *args, **kwargs):
        super(CacheListUpdater,self).__init__(*args, **kwargs)
        self.shared = shared

    def prepare(self,database):
        self.server = self.shared.server
        self.database = database

    def run(self):
        if self.server != None and self.database != None:
            self.updateCacheDict()

    def updateCacheDict(self):
        from models.currencyschema import currencies_schema, CurrencySchema

        while True:
            time.sleep(Config.CACHE_TASK_TIMER)
            currencies_json = currencies_schema.dump(CacheListUpdater.getPopularCoins())
            new_cache_dict = CurrencySchema.currenciesSchemaCacheDict(currencies_json)
            for currency in new_cache_dict:
                if currency not in self.server.cache:
                    self.server.cache = new_cache_dict
                    print("Cache atualizado: ",new_cache_dict)
                    break

    def getPopularCoins():
        from dao.currencydao import CurrencyDao

        return CurrencyDao.getPopularCoins(Config.CACHE_SIZE)