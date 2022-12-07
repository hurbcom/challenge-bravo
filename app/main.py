from fastapi import FastAPI, status

from app.routers import converter, currencies

app = FastAPI()

app.include_router(currencies.router)
app.include_router(converter.router)
