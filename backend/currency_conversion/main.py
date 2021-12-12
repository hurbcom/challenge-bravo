from fastapi import FastAPI
from controllers import routes
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi_jwt_auth.exceptions import AuthJWTException
from models import models
from database import engine

#Cria um banco de dados sqlite3.db dentro da pasta do Projeto. Se ja existir um banco não é feito nada.
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )

app.include_router(routes.routers)