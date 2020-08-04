import redis

from flask import Flask
from flask_caching import Cache

REDIS_PASSWORD = 'sOmE_sEcUrE_pAsS'

config = {
    'CACHE_TYPE': 'redis',
    'CACHE_DEFAULT_TIMEOUT': 1,
    'CACHE_KEY_PREFIX': 'cache_',
    'CACHE_REDIS_HOST': 'db',
    'CACHE_REDIS_PASSWORD': REDIS_PASSWORD
}

app = Flask(__name__)
app.config.from_mapping(config)
cache = Cache(app)

redis_pool = redis.ConnectionPool(
    host='db',
    password=REDIS_PASSWORD,
    encoding='utf-8',
    decode_responses=True
)

Redis = redis.Redis(connection_pool=redis_pool)

from api.exchange_api import ExchangeAPI

OpenExchangeApi = ExchangeAPI(
    openexchange_id='9e99dd7952614fb494bc2fa538c7a7c4',
    coinlayer_access_key='1dd48014a13e2682db13695e7baa2f41'
)

from api.views import convert, currencies

if __name__ == "__main__":
    app.run(host='0.0.0.0')