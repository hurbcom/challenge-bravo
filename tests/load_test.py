import requests
import threading, concurrent
import time, random
from queue import Queue

# É recomendado que o host da aplicação rode num host separado dos testes 
# pois há um pico de utilização de CPU que pode comprometer o resultado dos testes

url = "http://challengebravohurb.sa-east-1.elasticbeanstalk.com/api/convert/" 
# url = "http://192.168.1.9:5000/api/convert/" 

coins = ['USD', 'BRL', 'EUR', 'BTC', 'ETH']

batch = 1000 ## Quantidade de requests
loop = 5 ## Quntas vezes o teste irá se repetir

current_sucessful_requests = []
batch_times = []

response_time = []
successful = []

def test_request_load(t_queue, base, target, value):
    querystring = {"base":base,"target":target,"value":value}
    try: 
        temp = time.time()
        response = requests.request("GET", url, params=querystring)
        if response.status_code == 200:
            response_time.append(round(time.time() - temp, 3))
            current_sucessful_requests.append(response) 
    except:
        pass
    return 

#Esse método estabelece uma conexão inicial o servidor a mantem aberta, para o tempo de busca não comprometer o teste
def set_up(base, target, value):
    querystring = {"base":base,"target":target,"value":value}
    try: 
        response = requests.request("GET", url, params=querystring) 
    except:
        pass
    return 

elapsed_time = 0.00

def execute_requests():
    global elapsed_time
    start_time = time.time()
    thread_list = []
    q = Queue()

    for i in range(batch):
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

try:
    set_up('USD', 'BRL', 1)

    for i in range(0, loop):
        execute_requests()
        print(f'\nBatch Response Time: {round(elapsed_time, 3)}s')
        print(f'Sucessful Requests: {len(current_sucessful_requests)}')
        print(f'Repeats Remaining: {loop - (i + 1)}')
        batch_times.append(elapsed_time)
        successful.append(len(current_sucessful_requests))
        elapsed_time = 0
        current_sucessful_requests.clear()
        time.sleep(1)

    batch_time_mean = sum(batch_times) / float(len(batch_times))
    successful_response_mean = sum(successful) / float(len(successful))
    response_time_mean = sum(response_time) / float(len(response_time))
    
    print(f'\nTestes finalizados...')
    print(f'Média de Tempo de Cada Resposta: {round(response_time_mean * 1000)} ms')
    print(f'Média de Tempo de Todas Respostas Concorrentes: {round(batch_time_mean, 3)} s')
    print(f'Média de Sucesso: {successful_response_mean} de {batch}')
    print(f'Acurácia : {100 * (successful_response_mean / batch)}%\n')
except KeyboardInterrupt:
    sys.exit(1)

