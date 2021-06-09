import redis
import os



def connect_to_redis():
    host = os.environ.get('DB_HOST', 'localhost')
    port = os.environ.get('DB_PORT', 6379)
    db = os.environ.get('DB_NUMBER', 0)
    return redis.Redis(host=host, port=port, db=db)
