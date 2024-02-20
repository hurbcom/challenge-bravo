import logging
from time import time

from starlette.middleware.base import (
    BaseHTTPMiddleware,
    RequestResponseEndpoint,
)
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger(__name__)


class ResponseTimeMiddleware(BaseHTTPMiddleware):
    """
    A ideia desse middleware é de retornar o valor de response
    time dos endpoints chamados.
    """

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        initial_time = time()
        response = await call_next(request)
        final_time = time() - initial_time
        elapsed_time = round(final_time, 3)
        msg = f"{request.method}-{request.url.path} - Response: {elapsed_time}"
        logger.info(msg, extra={"elapsed_time": elapsed_time})
        return response
