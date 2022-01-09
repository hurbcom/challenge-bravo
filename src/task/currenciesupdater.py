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
            time.sleep(Config.UPDATE_TASK_TIMER)
            self.database.updateCurrencies()

