# -*- coding: utf-8 -*-
from desafio import settings, commands, moeda
import json
import datetime

from flask import Flask
from bson.objectid import ObjectId
from contextlib import contextmanager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand
from flask_redis import FlaskRedis
from flask_caching import Cache


db = SQLAlchemy()
migrate = Migrate()
cache = Cache()
redis_store = FlaskRedis()


def create_app(config_object=settings.ProdConfig):
    app = Flask(__name__.split('.')[0])
    app.url_map.strict_slashes = False
    app.config.from_object(config_object)
    register_extensions(app)
    register_blueprints(app)
    register_shellcontext(app)
    register_commands(app)
    return app


def register_blueprints(app):
    app.register_blueprint(moeda.views.blueprint)


def register_shellcontext(app):
    def shell_context():
        return {
            'db':  db,
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
    app.cli.add_command('db', MigrateCommand)


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)


@contextmanager
def session_scope(expire=False):
    session = db.session()
    session.expire_on_commit = False
    try:
        yield session
        db.session.commit()
    except:
        db.session.rollback()
        raise
    finally:
        db.session.close()
