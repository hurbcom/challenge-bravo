from os import getenv
from flask import Flask
from dotenv import load_dotenv
from mongoengine import connect

from exception import global_exception_handler
from .swagger import configure_swagger

load_dotenv()

mongodb_uri = getenv("MONGODB_URI")
env = getenv("ENV")

if env == "test":
    connect(db=f"bravo-{env}", host=mongodb_uri)
else:
    connect(db="bravo", host=mongodb_uri)

app = Flask(__name__)

global_exception_handler(app)
configure_swagger(app)
