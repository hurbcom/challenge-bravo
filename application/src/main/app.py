import os
import flask
import logging
from pymongo import MongoClient
from flask_restful import Resource, Api

app = flask.Flask(__name__)
logger = logging.getLogger('challange-bravo.log')
db_name = 'bravo'
client = MongoClient("mongo:27017")
api = Api(app, prefix="/api/v1")