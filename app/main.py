from fastapi import FastAPI, status
from app.routers import currencies

app = FastAPI()

app.include_router(currencies.router)