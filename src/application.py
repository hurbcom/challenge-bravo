#!/usr/bin/env python
# -*- coding: utf-8 -*- 
import sys, os

from api import application
from flask import render_template

@application.route('/')
@application.route('/index')
def index():
    return render_template('index.html')

#################### Usar este para deploy local ####################
if __name__ == '__main__':
    application.run()

#################### WSGI básico interno do python para deploy no AWS Elastic Beanstalk - O unico que consegui usar no EB #####################
# from wsgiref.simple_server import make_server

# if __name__ == '__main__':
#     httpd = make_server('', 5000, application)
#     httpd.serve_forever()
