#!/usr/bin/env python
# -*- coding: utf-8 -*- 
import sys, os

from flask import Flask
from flask_restful import Api
from controllers import Convert

app = Flask(__name__)

app.route('/')
api = Api(app)
api.add_resource(Convert, '/convert/')

#Para expor aplicação remotamente no Linux
# app.run(host='0.0.0.0', threaded=True)
app.run()