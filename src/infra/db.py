from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from sqlalchemy_utils import database_exists, create_database

from integration.currencyintegration import CurrencyIntegration


class Database():
    db = SQLAlchemy()
    ma = Marshmallow()

    def __init__(self,config):
        self.config = config

    def initDb(self,app):
        app.config ['SQLALCHEMY_DATABASE_URI'] = self.config.DATABASE_PATH
        app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        #'sqlite:///currencies.sqlite3'
        self.db.init_app(app)
        self.ma.init_app(app)
        self.createDb(app)

    def createDb(self,app):
        if not database_exists(self.config.DATABASE_PATH):
            with app.app_context():
                self.db.create_all()
                self.seedDb()

    def dropDb(self):
        drop_databse(self.config.DATABASE_PATH)

    def getDb(self):
        return self.db

    def seedDb(self):
        self.updateCurrencies()

    def updateCurrencies(self):
        from dao.currencydao import CurrencyDao

        for coin in self.config.INITIAL_COINS:
            value = CurrencyIntegration.getCurrencyInMainCurrency(coin)
            CurrencyDao.saveOrUpdateCurrencyIntern(coin,value)

    def getPopularCoins(self):
        from dao.currencydao import CurrencyDao

        return CurrencyDao.getPopularCoins(self.config.CACHE_SIZE)