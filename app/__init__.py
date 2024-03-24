from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):  # pragma: no cover
    # Valores aqui executam antes do sistema subir
    yield
    # E aqui quando o sistema está sendo fechado.
