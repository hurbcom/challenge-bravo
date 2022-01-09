from flask import Flask
from flask_restx import Api
import time, threading

from infra.db import *
from server.config import Config
from task.currenciesupdater import CurrenciesUpdaterTask
from task.cachelistupdater import CacheListUpdater

class Server(Flask):
    cache = []

    def run(self, host=None, port=None, debug=None, load_dotenv=True, **options):
        if not self.debug or os.getenv('WERKZEUG_RUN_MAIN') == 'true':
            with self.app_context():
                self.start()
        super(Server, self).run(host=host, port=port, debug=debug, load_dotenv=load_dotenv, **options)

    def setUp(self,config):
        self.api = Api( self,
                        version='1.0',
                        title='challenge-bravo',
                        description='simple currency consultor api')
        self.database = Database(config)
        self.database.initDb(self)
        print("Iniciei base")

    def runServerTasks(self):
        def currencies():
            currency_database_obj = Database(Config)
            currency_database_obj.initDb(self)
            currencies_updater_task = CurrenciesUpdaterTask(currency_database_obj)
            currencies_updater_task.updateCurrencies()

        def cache():
            cache_database_obj = Database(Config)
            cache_database_obj.initDb(self)
            cache_updater_task = CacheListUpdater(cache_database_obj)
            cache_updater_task.updateCacheList(self)

        thread_currencies_updater = threading.Thread(target=currencies)
        thread_cache_updater = threading.Thread(target=cache)
        thread_currencies_updater.start()
        thread_cache_updater.start()

    def start(self):
        self.runServerTasks()
        print("Iniciei tasks")

server = Server(__name__)
server.setUp(Config)

