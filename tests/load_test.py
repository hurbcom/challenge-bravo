import requests
import threading
import time, random
from queue import Queue

coins = ['USD', 'BRL', 'EUR', 'BTC', 'ETH']
threads = 1000
sucessful = []

def test_request_load(t_queue, base, target, value):
    url = "http://192.168.1.103:5000/api/convert"
    querystring = {"base":base,"target":target,"value":value}
    try: 
        response = requests.request("GET", url, params=querystring) 
        if response.status_code == 200:
            sucessful.append(response)
    except:
        pass

elapsed_time = 0.00

def execute_requests():
    global elapsed_time
    start_time = time.time()
    thread_list = []
    q = Queue()

    for i in range(threads):
        base = coins[random.randint(0, len(coins) - 1)]
        target = coins[random.randint(0, len(coins) - 1)]
        value = random.randint(i + 1, 100000)
        t = threading.Thread(target=test_request_load, args=(q, base, target, value))
        thread_list.append(t)

    for t in thread_list:
        t.start()

    for t in thread_list:
        t.join()

    elapsed_time = time.time() - start_time
    return

execute_requests()

print(f'Elapsed time: {elapsed_time}')
print(f'Sucessful requests: {len(sucessful)}')
