# import requests
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import requests
from time import sleep

from config import settings
from models import OficialCoins
from schemas import Currency



def main():
    SQLALCHEMY_DATABASE_URL = f"postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}"

    engine = create_engine(SQLALCHEMY_DATABASE_URL)

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    db = SessionLocal()
    db.query(OficialCoins).delete() # delete table data before update
    db.execute("ALTER SEQUENCE oficial_coins_id_seq RESTART WITH 1") # reset autoincrement in id column

    res = requests.get('https://api.coinbase.com/v2/exchange-rates', params={'currency': 'USD'})
    currencies = res.json()['data']['rates']
    for currency_code, rate in currencies.items():
        currency = Currency(currency_code=currency_code, rate=rate)
        currency_db = OficialCoins(currency_code=currency.currency_code, rate=currency.rate)
        db.add(currency_db)
    db.commit()
    db.close()
    print(f"Database updated at: {datetime.utcnow()} UTC")

if __name__ == "__main__":
    sleep(60)
    main()