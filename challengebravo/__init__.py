# -*- coding: utf-8 -*-
"""
Created on Tue Aug 31 22:03:23 2021

@author: lucas
"""


import os

from flask import Flask
from flask_apscheduler import APScheduler
from . import coinbase_caller

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'challengebravo.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    scheduler = APScheduler()
    scheduler.init_app(app)
    scheduler.add_job(func=currency_updater, trigger="interval", seconds=30, id='currencyUpdater')
    scheduler.start()

    from . import db
    db.init_app(app)

    from . import exchange_price
    app.register_blueprint(exchange_price.bp)

    return app

def currency_updater():
    app = Flask(__name__)
    with app.app_context():
        coinbase_caller.update_currency_values()