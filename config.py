# -*- coding: utf-8 -*-
"""
Created on Sat Aug 02 01:18:51 2021
@author: Wilson Ricardo Pereira Silveira
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

DEBUG = False

HOST = os.getenv("IP_ADDRESS") or "0.0.0.0"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

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
db.init_app(app)
db.create_all()

from currency_exchange.blueprints.scrapping.publicAPI import default_currencies
default_currencies()