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

    def upd_cache_value_to_json_del(self, key, dict_id, call=1):
        """
        Updates dictionary saved in the cache key
        :param key: cache key
        :param dict_id: dictionary key saved in the cache key
        :param call: <1(return json) or n(return boolean)>
        :return: json or boolean
        """
        content = self.get_cache_value_to_json(key=key)
        if content.pop(dict_id, None) is None:
            return content if call == 1 else False
        self.set(key=key, value=content, serialization=True)
        return content if call == 1 else True
