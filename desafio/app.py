# -*- coding: utf-8 -*-
from desafio import settings, commands, currency
import json
import datetime
import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand
from desafio.extensions import cache, db, migrate, redis_store


def create_app(config_object=settings.ProdConfig):
    app = Flask(__name__.split('.')[0], instance_relative_config=True)
    app.url_map.strict_slashes = False
    app.config.from_object(config_object)
    register_extensions(app)
    register_blueprints(app)
    register_shellcontext(app)
    register_commands(app)
    return app


def register_blueprints(app):
    app.register_blueprint(currency.views.bp)
    app.register_blueprint(currency.views.default)


def register_shellcontext(app):
    def shell_context():
        return {
            'db':  db,
            'Currency': currency.model.Currency
        }

    app.shell_context_processor(shell_context)


def register_extensions(app):
    cache.init_app(app)
    db.init_app(app)
    redis_store.init_app(app)
    migrate.init_app(app, db)


def register_commands(app):
    app.cli.add_command(commands.test)
    app.cli.add_command(commands.init_db_command)
    app.cli.add_command(commands.seed)
    app.cli.add_command('db', MigrateCommand)
