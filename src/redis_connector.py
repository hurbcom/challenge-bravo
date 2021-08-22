import redis

PREFIX = '[REDIS CONNECTOR]'


class RedisConnector:
    def __init__(self):
        self.__conn = redis.Redis(host='localhost', port=6379, db=0)

    def get_connection(self):
        return self.__conn
