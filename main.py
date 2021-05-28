from fastapi import FastAPI

from challenge_bravo.settings import db_instance
from challenge_bravo.models import CoinModel


app = FastAPI()


@app.on_event('startup')
def initialize_database():
    """
    Startup event to initialize database
    """
    db_instance.connect()
    db_instance.create_tables([CoinModel])
    db_instance.disconnect()
