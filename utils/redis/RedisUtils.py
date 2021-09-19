import os
import jsonpickle
import base64

from fastapi import HTTPException
from redis import Redis
from starlette.status import HTTP_400_BAD_REQUEST


class RedisUtils:
    __redis_connection: Redis

    @staticmethod
    def __get_redis_connection() -> Redis:
        if hasattr(RedisUtils, "redis_connection") and RedisUtils.__redis_connection is not None:
            return RedisUtils.__redis_connection
        else:
            RedisUtils.__redis_connection = Redis(password=os.getenv("redis_access"))
            return RedisUtils.__redis_connection

    @staticmethod
    def salva_objeto(chave: str, objeto: any) -> None:
        RedisUtils.__get_redis_connection().set(chave, base64.b64encode(jsonpickle.encode(objeto).encode()).decode())

    @staticmethod
    def recupera_objeto(chave: str) -> any:
        return jsonpickle.decode(base64.b64decode(RedisUtils.__get_redis_connection().get(chave).decode()).decode())

    @staticmethod
    def verifica_existencia_chave(chave: str) -> bool:
        return RedisUtils.__get_redis_connection().exists(chave)

    @staticmethod
    def apaga_chave (chave: str) -> None:
        RedisUtils.__get_redis_connection().delete(chave)
