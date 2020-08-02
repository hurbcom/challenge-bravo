import redis

from flask import Flask
from flask_caching import Cache

config = {
    'CACHE_TYPE': 'redis',
    'CACHE_DEFAULT_TIMEOUT': 1,
    'CACHE_KEY_PREFIX': 'cache_',
    'CACHE_REDIS_HOST': 'db',
    'CACHE_REDIS_PASSWORD': 'sOmE_sEcUrE_pAsS'
}

app = Flask(__name__)
app.config.from_mapping(config)
cache = Cache(app)

redisConnector = redis.Redis(
    host='db',
    password='sOmE_sEcUrE_pAsS',
    encoding='utf-8',
    decode_responses=True
)

from api.views import convert, currencies