from functools import wraps

from fastapi import HTTPException
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR


def exception_handler(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            raise HTTPException(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erro não esperado na execucao do request: {str(e)}!"
            )
    return wrapper
