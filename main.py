from fastapi import FastAPI
from fastapi.responses import RedirectResponse

from challenge_bravo.models import CoinModel
from challenge_bravo.routes import router as coin_router
from challenge_bravo.settings import db_instance


app = FastAPI()


@app.on_event('startup')
def initialize_database():
    """
    Startup event to initialize database.
    """
    db_instance.connect()
    db_instance.create_tables([CoinModel])
    db_instance.close()


@app.get('/', status_code=403)
def main():
    """ 
    Main view.
    If called, redirects to the main API route.
    """
    return RedirectResponse('/api/v1/')


app.include_router(coin_router, prefix='/api/v1', tags=['coin'])
