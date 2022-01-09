import time
from server.config import Config
from integration.currencyintegration import CurrencyIntegration

class CurrenciesUpdaterTask():
    def updateCurrencies(server):
        while True:
            time.sleep(Config.UPDATE_TASK_TIMER)
            server.database.updateCurrencies()

