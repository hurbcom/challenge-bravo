# -*- coding: utf-8 -*-
"""
Created on Tue Aug 31 22:03:23 2021

@author: lucas
"""


def create_app():
    app = ...
    # existing code omitted

    from . import db
    db.init_app(app)

    return app