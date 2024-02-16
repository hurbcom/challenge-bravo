from functools import lru_cache

from httpx import Client


@lru_cache
def return_client_http() -> Client:
    return Client(timeout=15)
