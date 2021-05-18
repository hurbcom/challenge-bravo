import json
import redis
import pickle
import pandas


class RedisCacheService:
    def __init__(self, host, port, db, password):
        self.cache = redis.StrictRedis(
            host=host,
            port=port,
            db=db,
            password=password
        )

    def set(self, key, value, serialization=False):
        if serialization:
            self.cache.set(key, pickle.dumps(value))
        else:
            self.cache.set(key, value)

    def get(self, key, serialization=False):
        result = self.cache.get(key)
        if serialization and result is not None:
            result = pickle.loads(result)
        return result

    def flush(self):
        return self.cache.flushall()

    def keys(self):
        return self.cache.keys()

    def get_cache_value_to_json(self, key):
        data = self.get(key=key, serialization=True)
        if isinstance(data, pandas.DataFrame):
            data = json.loads(data.to_json(orient='records'))
        if data is None:
            data = {}
        return data
