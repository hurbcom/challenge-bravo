from twisted.enterprise import adbapi
import datetime,logging
from twisted.internet import reactor, defer
import functools


"""
Test DB : This File do database connection and basic operation.
"""

log = logging.getLogger("Test DB")

dbpool = adbapi.ConnectionPool("sqlite3", "database/db.sqlite3", check_same_thread=False)

class AgentDB():

    def ensure_deferred(f):
        @functools.wraps(f)
        def wrapper(*args, **kwargs):
            result = f(*args, **kwargs)
            return defer.ensureDeferred(result)
        return wrapper

    @ensure_deferred
    def doSelect(self, email):

        log.info("Select operation in Database.")
        query = ("SELECT * FROM auth WHERE email = '%s'" % (email))
        yield dbpool.runQuery(query).addCallback(self.receiveResult).addErrback(self.errorquery)


    @ensure_deferred
    async def receiveResult(self,result):
        print ("Receive Result")
        print (result)
        # general purpose method to receive result from defer.
        return result

    @ensure_deferred
    def errorquery(self,result):
        print ("error received", result)
        return result




