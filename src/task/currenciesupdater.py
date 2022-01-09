import time
from server.config import Config
from integration.currencyintegration import CurrencyIntegration

class CurrenciesUpdaterTask():

    def __init__(self,database):
        self.database = database

    def updateCurrencies(self):
        while True:
            time.sleep(Config.UPDATE_TASK_TIMER)
            self.database.updateCurrencies()

