from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from sqlalchemy_utils import database_exists, create_database

from integration.currencyintegration import CurrencyIntegration
from server.config import Config

class Database():
    db = SQLAlchemy()
    ma = Marshmallow()
    migrate = Migrate()
    def initDb(self,app):
        app.config ['SQLALCHEMY_DATABASE_URI'] = Config.DATABASE_PATH
        app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        #'sqlite:///currencies.sqlite3'
        self.db.init_app(app)
        self.ma.init_app(app)
        self.migrate.init_app(app,self.db)
        self.createDb(app)

    def createDb(self,app):
        if not database_exists(Config.DATABASE_PATH):
            with app.app_context():
                self.db.create_all()
                self.seedDb()

    def dropDb(self):
        drop_databse(Config.DATABASE_PATH)

    def getDb(self):
        return self.db

    def seedDb(self):

        from dao.currencydao import CurrencyDao

        for coin in Config.INITIAL_COINS:
            value = CurrencyIntegration.getCurrencyInMainCurrency(coin)
            CurrencyDao.saveOrUpdateCurrency(coin,value)
