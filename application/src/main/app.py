import os
import flask
import logging
from pymongo import MongoClient
from flask_restful import Resource, Api

app = flask.Flask(__name__)

logger = logging.getLogger('challange-bravo.log')

db_name = 'bravo'
client = MongoClient("mongo:27017")
# myclient = MongoClient("mongodb://localhost:27017/")
# mydb = client["mydatabase"]
# mycol = mydb["customers"]
# x = mycol.find_one()

# dbnames = client.list_database_names()
# if db_name not in dbnames:
#     mongodb = client[db_name]
#     logger.info ("Database created")
# else:
#     mongodb = client[db_name]

api = Api(app, prefix="/api/v1")
