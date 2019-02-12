#!/usr/bin/env python
# -*- coding: utf-8 -*- 
import sys, os

from wsgiref.simple_server import make_server
from api import application
from flask import render_template_string

@application.route('/')
@application.route('/index')
def index():
    html_index_str = """
        <h1>API em Funcionamento</h1>
    """
    return render_template_string(html_index_str)

if __name__ == '__main__':
    httpd = make_server('', 5000, application)
    httpd.serve_forever()