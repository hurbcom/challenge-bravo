from fastapi import FastAPI
from uvicorn import run

from app.api.v1.currency_converter.endpoint import router as currency_converter_router
from app.api.v1.health_check import router as health_check_router
from app.utils.config import default_settings

settings = default_settings()
app = FastAPI()
api_v1 = "/api/v1"
app.include_router(health_check_router, prefix=api_v1)
app.include_router(currency_converter_router, prefix=api_v1)


if __name__ == "__main__":
    run(
        app=app,
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.IS_DEBUG,
        workers=settings.WORKERS,
    )
