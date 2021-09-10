from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from tortoise.contrib.fastapi import register_tortoise
from config.db import db_config
from fastapi.exceptions import HTTPException
import routers

app = FastAPI(name="Currency Exchanger")

register_tortoise(
    app=app,
    modules={"models": ["models"]},
    config=db_config,
    generate_schemas=True,
    add_exception_handlers=True,
)

app.include_router(routers.router)


@app.exception_handler(HTTPException)
async def unicorn_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )
