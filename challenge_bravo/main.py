from fastapi import FastAPI

from .models import CoinModel
from .routers import coins_router
from .routers import main_router
from .settings import db_instance
from .utils import create_database_default_coins


app = FastAPI()


@app.on_event('startup')
def initialize_database():
    """ Startup event to initialize database. """

    db_instance.connect()
    db_instance.create_tables([CoinModel])
    create_database_default_coins()
    db_instance.close()


app.include_router(main_router)
app.include_router(coins_router, prefix='/api/v1/coins', tags=['coins'])
