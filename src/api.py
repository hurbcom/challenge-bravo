#!/usr/bin/env python
# -*- coding: utf-8 -*- 
import sys, os

from flask import Flask
from flask_restful import Api
from controllers import Convert

application = Flask(__name__)

api = Api(application)
api.add_resource(Convert, '/api/convert/')

if __name__ == '__main__':
    application.run(host='0.0.0.0', threaded=True)
