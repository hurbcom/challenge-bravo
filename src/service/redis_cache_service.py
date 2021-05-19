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
        contents = self.get_cache_value_to_json(key=key)
        contents.pop(dict_id, None)
        self.set(key=key, value=contents, serialization=True)
        return contents

    def upd_cache_value_to_json_ins(self, key, dict_id, dict_val):
        """
        Create if Id not exists. Update otherwise the dictionary saved in the cache key
        :param key: cache key
        :param dict_id: Dictionary key Id saved in the cache key
        :param dict_val: List with Dictionary key value [name, API(true) or USER(fictitious)]
        :return: content cache key in json
        """
        contents = self.get_cache_value_to_json(key=key)
        contents.update({dict_id: dict_val})
        self.set(key=key, value=contents, serialization=True)
        return contents

    def check_id_exists_in_cache_value_to_json(self, key, dict_id):
        """
        Create if Id exists in cache value
        :param key: cache key
        :param dict_id: Dictionary key Id saved in the cache key
        :return: boolean
        """
        contents = self.get_cache_value_to_json(key=key)
        return True if contents.get(dict_id, None) is not None else False
