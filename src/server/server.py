from flask import Flask
from flask_restx import Api
import time, threading, os

from infra.db import *
from server.config import Config
from task.currenciesupdater import CurrenciesUpdaterTask
from task.cachelistupdater import CacheListUpdater

class ServerSharedObject(object):
    def __init__(self, server):
        self.server = server

class Server(Flask):
    cache = {}

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

    def runServerTasks(self):
        # setup currency updater task
        currency_database_obj = Database(Config)
        currency_database_obj.initDb(self)
        currencies_updater_task = CurrenciesUpdaterTask(shared=sharedServer)
        currencies_updater_task.prepare(currency_database_obj)

        # setup cache updater task
        cache_database_obj = Database(Config)
        cache_database_obj.initDb(self)
        cache_updater_task = CacheListUpdater(shared=sharedServer)
        cache_updater_task.prepare(cache_database_obj)

        #running tasks
        cache_updater_task.start()
        currencies_updater_task.start()

    def start(self):
        self.runServerTasks()

server = Server(__name__)
server.setUp(Config)
sharedServer = ServerSharedObject(server)

