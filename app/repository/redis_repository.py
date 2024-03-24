import json
import logging

from redis import Redis

logger = logging.getLogger(__name__)
TWO_HOURS = 7200


class RedisRepository:
    def __init__(self) -> None:
        self.client = Redis(host="localhost", port=6379, decode_responses=True)

    def create(self, key, value):
        return self.client.set(key, json.dumps(value), ex=TWO_HOURS)

    def get(self, key):
        value = self.client.get(key)
        try:
            decoded_value = json.loads(value)
        except Exception:
            return None
        return decoded_value
