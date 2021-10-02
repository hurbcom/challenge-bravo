from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

DEBUG = True
API_VERSION = 'v1'

HOST = os.getenv("IP_ADDRESS") or "0.0.0.0"
BASE_DIR = ''


app = Flask(__name__)

if DEBUG:
    app.config['TESTING'] = True
    app.config['DEBUG'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hurbchallange.sqlite3'
    app.config['SQLALCHEMY_ECHO'] = True
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
else:
    app.config['TESTING'] = False
    app.config['DEBUG'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hurbchallange.sqlite3'
    app.config['SQLALCHEMY_ECHO'] = False
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)