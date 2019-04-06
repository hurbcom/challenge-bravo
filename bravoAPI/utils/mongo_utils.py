
import pymongo as pym
from config import *

def create_client(host, port):
    return pym.MongoClient(host, port)


def get_database(client, database_name):
    return client[database_name]


def get_collection(db, collection_name):
    return db[str(collection_name)]


def open_mongo_connection():
    res = True
    try:
        client = create_client(ADRESS, int(PORT))
        db     = get_database(client, DATABASE)
        db.authenticate(USER, PASS)
        col    = get_collection(db, COLLECTON)
    except Exception as ex:
        res = False
    return col, res