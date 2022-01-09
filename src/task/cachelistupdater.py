from server.config import Config
import models
import time

class CacheListUpdater():

    def __init__(self,database):
        self.database = database

    def updateCacheList(self,server):
        from models.currencyschema import currencies_schema, CurrencySchema

        while True:
            time.sleep(Config.CACHE_TASK_TIMER)
            currencies_json = currencies_schema.dump(self.database.getPopularCoins())
            new_cache_list = CurrencySchema.currenciesSchemaNameList(currencies_json)
            if new_cache_list != server.cache:
                server.cache = new_cache_list
                print("Cache atualizado: ",new_cache_list)
