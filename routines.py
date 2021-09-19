import asyncio
import os
import requests
import time
from arq import cron, Worker
from arq.connections import RedisSettings

from currencies_store.AllowedCurrencies import AllowedCurrencies
from utils.redis.RedisUtils import RedisUtils


def update_redis_currencies(actual_currency: dict) -> None:
    RedisUtils.salva_objeto("currency:base", os.getenv("base_currency", "USD"))
    RedisUtils.salva_objeto("currency:timestamp", f"{time.time()}")

    rates_supported_currencies = dict(
        (k, actual_currency[k]) for k in AllowedCurrencies.get_allowed_currencies() if
        k in actual_currency)

    for k, v in rates_supported_currencies.items():
        for k2, v2 in rates_supported_currencies.items():
            RedisUtils.salva_objeto(f"currency:{k}:{k2}", v / v2)


def update_eth_currency(actual_currency) -> dict:
    eth = requests.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD").json()['USD']
    dict_eth = {"ETH": float(eth)}
    return dict_eth


def update_default_currencies() -> dict:
    currencies = requests.get(
        f"https://openexchangerates.org/api/latest.json?app_id={os.getenv('currencies_api_id')}").json()
    return currencies['rates']


def salva_moedas_default(actual_currency):
    default_keys = list(actual_currency.keys())
    RedisUtils.salva_objeto("currency:default_currencies", default_keys)


async def update_currencies(ctx):
    actual_currency = {}
    actual_currency.update(update_default_currencies())
    actual_currency.update(update_eth_currency(actual_currency))
    salva_moedas_default(actual_currency)
    update_redis_currencies(actual_currency)
    print("corrotina rodada!!")


class WorkerSettings:
    cron_jobs = [
        cron(update_currencies, second=0, minute=0)
    ]
    on_startup = update_currencies
    redis_settings = RedisSettings(password=os.getenv("redis_access"))


def inicia_rotinas():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    Worker(redis_settings=WorkerSettings.redis_settings, cron_jobs=WorkerSettings.cron_jobs,
           on_startup=WorkerSettings.on_startup).run()


if __name__ == "__main__":
    inicia_rotinas()
