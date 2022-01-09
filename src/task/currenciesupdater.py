from celery import Celery
import time
from server.config import Config
from integration.currencyintegration import CurrencyIntegration


class CurrenciesUpdaterTask():
    def run():
        #while True:
        self.updateCurrencies()

    def updateCurrencies():
        for currency in Config.INITIAL_COINS:
            value = CurrencyIntegration.getCurrencyInMainCurrency(coin)
            CurrencyDao.saveOrUpdateCurrency(coin,value)
        timer.sleep(1)
