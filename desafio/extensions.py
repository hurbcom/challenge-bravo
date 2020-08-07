from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_redis import FlaskRedis
from flask_caching import Cache

db = SQLAlchemy()
migrate = Migrate()
cache = Cache()
redis_store = FlaskRedis()
