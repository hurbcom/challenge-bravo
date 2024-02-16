from fastapi import FastAPI
from uvicorn import run

from app.api.v1.health_check import router as health_check_router
from app.utils.config import default_settings

settings = default_settings()
app = FastAPI()
app.include_router(health_check_router, prefix="/api/v1")


if __name__ == "__main__":
    run(
        app=app,
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.IS_DEBUG,
        workers=settings.WORKERS,
    )
