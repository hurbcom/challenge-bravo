#!/usr/bin/env python
# -*- coding: utf-8 -*- 
import sys, os

from api import application
from flask import render_template_string

@application.route('/')
@application.route('/index')
def index():
    html_index_str = """
        <h1>API em Funcionamento</h1>
    """
    return render_template_string(html_index_str)

#################### Usar este para deploy local ####################
if __name__ == '__main__':
    application.run()

#################### WSGI básico interno do python para deploy no AWS Elastic Beanstalk - O unico que consegui usar no EB #####################
# from wsgiref.simple_server import make_server

# if __name__ == '__main__':
#     httpd = make_server('', 5000, application)
#     httpd.serve_forever()
