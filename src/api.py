#!/usr/bin/env python
# -*- coding: utf-8 -*- 
import sys, os

from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from controllers import Convert

application = Flask(__name__)
cors = CORS(application, resources={r'/api/*': {'origins':'*'}})
api = Api(application)
api.add_resource(Convert, '/api/convert/')

if __name__ == '__main__':
    application.run(host='0.0.0.0', threaded=True)
