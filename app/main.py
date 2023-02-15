import asyncio

from fastapi import FastAPI

from app.routers import convert_router, currency_router
from app.utils.update_coinbase_currencies_prices import \
    update_coinbase_currencies_prices_task

app = FastAPI()

app.include_router(currency_router.router)
app.include_router(convert_router.router)


@app.on_event("startup")
async def start_update_task():
    asyncio.create_task(update_coinbase_currencies_prices_task())
