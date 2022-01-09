from server.server import *
from controllers.conversion import *
from controllers.currency import *
import os, time

#celery = make_celery(server.app)

#@celery.task(name='app.updatecurrenciestask')
#def updateCurrenciesTask():
    #CurrenciesUpdaterTask.updateCurrencies()

#pid = os.fork()
#if pid > 0:
    #time.sleep(10)
    #result = updateCurrenciesTask.delay()
    #result.get()
    #print("task")
#else:
    #print("server")
server.run()

