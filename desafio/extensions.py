from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_redis import FlaskRedis
from flask_caching import Cache
from contextlib import contextmanager
from bson.objectid import ObjectId
import json
import datetime


db = SQLAlchemy()
migrate = Migrate()
cache = Cache()
redis_store = FlaskRedis()


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


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)
