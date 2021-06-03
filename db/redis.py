import redis
import os


def connect_to_redis():
    host = os.environ.get('redisHost', 'localhost')
    port = os.environ.get('redisPort', 6379)
    db = os.environ.get('redisDb', 0)
    return redis.Redis(host=host, port=port, db=db)
