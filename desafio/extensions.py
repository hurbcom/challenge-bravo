from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_redis import FlaskRedis
from flask_caching import Cache
from contextlib import contextmanager


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
