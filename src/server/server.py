from flask import Flask
from flask_restx import Api
from celery import Celery

from infra.db import *
from server.config import Config
from task.currenciesupdater import CurrenciesUpdaterTask

class Server():
    def __init__(self, config):
        self.app = Flask(__name__)
        self.api = Api(self.app,
              version='1.0',
              title='challenge-bravo',
              description='simple currency consultor api')
        self.app.config.update(
            CELERY_BROKER_URL=config.CELERY_BROKE_PATH,
            CELERY_RESULT_BACKEND=config.CELERY_BACKEND_PATH,
        )
        self.database = Database(config)

    def run(self,):
        self.database.initDb(self.app)
        self.app.run(debug=True)

server = Server(Config)