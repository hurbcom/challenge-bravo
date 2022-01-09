from flask import Flask
from flask_restx import Api

from infra.db import *
from server.config import Config

class Server():
    def __init__(self, config):
        self.app = Flask(__name__)
        self.api = Api(self.app,
              version='1.0',
              title='challenge-bravo',
              description='simple currency consultor api')
        self.database = Database(config)

    def run(self,):
        self.database.initDb(self.app)
        self.app.run(debug=True)

server = Server(Config)
