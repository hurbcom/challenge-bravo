import time, threading
from server.config import Config
from integration.currencyintegration import CurrencyIntegration

class CurrenciesUpdaterTask(threading.Thread):
    def __init__(self, shared, *args, **kwargs):
        super(CurrenciesUpdaterTask,self).__init__(*args, **kwargs)
        self.shared = shared

    def prepare(self,database):
        self.database = database

    def run(self):
        if self.database != None:
            self.updateCurrencies()

    def updateCurrencies(self):
        while True:
            CurrenciesUpdaterTask.updateCurrenciesInDatabase()
            time.sleep(Config.UPDATE_TASK_TIMER)

    def updateCurrenciesInDatabase():
        from dao.currencydao import CurrencyDao

        for coin in Config.INITIAL_COINS:
            value = CurrencyIntegration.getCurrencyInMainCurrency(coin)
            CurrencyDao.saveOrUpdateCurrencyIntern(coin,value)

