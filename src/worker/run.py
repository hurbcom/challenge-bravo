import redis
import time
from get_online_rates import GetOnlineRates

try:
    pool = redis.ConnectionPool(host='redis', port=6379, max_connections=2, db=0)
    db = redis.Redis(connection_pool=pool)
except Exception as e:
    print('Redis connection error: %s' % (str(e)) )

# Infinity loop to update rates every 30 minutes
while True:
    print("\nUpdating rates\n")
    try:
        new_rates = GetOnlineRates()
        for new_rate in new_rates.rates:
            db.set(new_rate[0], new_rate[1])
            print(new_rate)
    except Exception as e:
        print(dict(error_message=str(e)))

    print("\nRates updated\n")
    
    time.sleep(900)