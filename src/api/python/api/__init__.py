import redis
from flask import Flask

app = Flask(__name__)

try:
    # Create a redis connection pool and pass to flask instance
    pool = redis.ConnectionPool(host='redis', port=6379, max_connections=20, db=0)
    db = redis.Redis(connection_pool=pool)
except Exception as e:
    print('Redis connection error: %s' % (str(e)) )
    exit(1)
