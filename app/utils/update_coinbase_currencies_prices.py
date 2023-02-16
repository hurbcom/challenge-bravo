import asyncio

import requests
from sqlalchemy import select, update, insert

from app.models.database import async_session
from app.models.models import CurrencyInfoModel
from app.schemas.convert import Currency


async def update_coinbase_currencies_prices_task():
    while True:
        async with async_session() as db:
            coinbase_currencies_response = requests.get(
                "https://api.coinbase.com/v2/exchange-rates", params={"currency": "USD"}
            )
            if coinbase_currencies_response.status_code == 200:
                currencies = coinbase_currencies_response.json()["data"]["rates"]
                for currency_code, rate in currencies.items():
                    currency = Currency(
                        currency_code=currency_code,
                        rate=rate,
                        backed_by="USD",
                        currency_type="coinbase"
                    )
                    existing_record = select([CurrencyInfoModel]).where(
                            CurrencyInfoModel.currency_code == currency.currency_code
                        )
                    existing_record = await db.execute(existing_record)
                    if existing_record.first():
                        update_query = (
                            update(CurrencyInfoModel)
                            .where(
                                CurrencyInfoModel.currency_code == currency.currency_code
                            )
                            .values(rate=currency.rate)
                        )
                        await db.execute(update_query)
                    else:
                        currency_db = insert(CurrencyInfoModel).values(
                            currency_code=currency.currency_code,
                            rate=currency.rate,
                            backed_by=currency.backed_by,
                            currency_type=currency.currency_type
                        )
                        await db.execute(currency_db)
                await db.commit()
            await db.close()

        await asyncio.sleep(60)
