import redis

from flask import Flask

app = Flask(__name__)
redisConnector = redis.Redis(
    host='db',
    password='sOmE_sEcUrE_pAsS',
    encoding='utf-8',
    decode_responses=True
)

from api.views import convert, currencies