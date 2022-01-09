from flask import Flask
from flask_restx import Api
import time, threading

from infra.db import *
from server.config import Config
from task.currenciesupdater import CurrenciesUpdaterTask

class Server(Flask):
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
        def run_job():
            CurrenciesUpdaterTask.updateCurrencies(self)
        thread = threading.Thread(target=run_job)
        thread.start()

    def start(self,):

        self.runServerTasks()
        print("Iniciei tasks")
        #pid = os.fork()
        #if pid > 0:
            #print("task")
            #time.sleep(10)
            #updateCurrenciesTask(server)

        #else:
            #print("server")
            #self.app.run(debug=True)

server = Server(__name__)
server.setUp(Config)

