#!/usr/bin/env python
# -*- coding: utf-8 -*- 
import sys, os

from flask import Flask
from flask_restful import Api
from controllers import Convert

app = Flask(__name__)
app.route('/')
app.host = '0.0.0.0'

api = Api(app)
api.add_resource(Convert, '/convert/')

if __name__ == '__main__':
    api.init_app(app)