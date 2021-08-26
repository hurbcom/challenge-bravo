import redis
import requests
import cache_updater_config

PREFIX = '[CACHE UPDATER]'

conn = redis.Redis(host='localhost', port=6379, db=0)
print(f'{PREFIX} - Opened redis connection!')

r = requests.get(cache_updater_config.api_endpoint,
                 params=cache_updater_config.params)
rates = r.json()['rates']
print(f'{PREFIX} - New rates acquired from api!')

conn.flushall()
for [key, value] in list(rates.items()):
    key = f'curr_{key}'
    conn.set(key, value)
print(f'{PREFIX} - Redis cache has been updated!')

conn.close()
print(f"{PREFIX} - Closed redis connection!")
