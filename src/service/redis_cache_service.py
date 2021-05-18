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

    def upd_cache_value_to_json_del(self, key, dict_id):
        """
        Updates dictionary saved in the cache key
        :param key: cache key
        :param dict_id: Dictionary key Id saved in the cache key
        :return: content cache key in json
        """
        content = self.get_cache_value_to_json(key=key)
        content.pop(dict_id, None)
        self.set(key=key, value=content, serialization=True)
        return content

    def upd_cache_value_to_json_ins(self, key, dict_id, dict_val):
        """
        Create if Id not exists. Update otherwise the dictionary saved in the cache key
        :param key: cache key
        :param dict_id: Dictionary key Id saved in the cache key
        :param dict_val: Dictionary key Value
        :return: content cache key in json
        """
        content = self.get_cache_value_to_json(key=key)
        content.update({dict_id: [dict_val, 'USER']})  # API or USER
        self.set(key=key, value=content, serialization=True)
        return content
