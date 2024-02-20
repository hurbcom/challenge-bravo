from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager

from app.utils.init_currencys import init_currency_values_in_bd


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_currency_values_in_bd()
    yield
