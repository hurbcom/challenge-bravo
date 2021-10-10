from pymongo import MongoClient
from src.utils.utils import getEnv

def mongo(db="coins"):
    user = getEnv('mongouser')
    password = getEnv('mongopassword')
    port = getEnv('mongoport')
    host = getEnv('mongohost')
    client = MongoClient(f'mongodb://{user}:{password}@{host}:{port}')
    return client[db]