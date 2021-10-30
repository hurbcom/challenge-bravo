from fastapi import FastAPI
from .routers.v1.api import api_router
from app.core.config import settings

app = FastAPI()


app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def read_root():
    return {"Hello": settings.API_EXCHANGE_KEY}
