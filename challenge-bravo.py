import json
import re
import time
import _thread
from urllib.parse import urlparse,urlsplit, parse_qsl
import http.server
import socketserver
import os.path
import requests
"""
    Servidor de Requisição de Cotação Monetária

    Cotações Suportadas Inicialmente:
        USD,BRL,EUR,BTC e ETH
    Para facilitar transações, utilizar modelo MOEDA -> DOLAR AMERICANO (USD) -> MOEDA REQUISITADA
    Suporte para adição de mais moedas
    Cotações efetuadas de 10 em 10 min (customizável) para não sobrecarregar API (limitação ainda desconhecida)
        Criar thread para fazer as cotações automaticamente, sendo a atualização uma chamada bloqueante e fazendo todas as outras threads esperarem para requisitar as informações
    Armazenar Cotações em arquivo
    Sempre que feita uma requisição, requisitar da RAM e não do arquivo
    
    exemplo de requisição:

    Verificação da Cotação
        localhost:8080/price?from=BRL&to=USD&amount=130.00
            Exibe cotação requisitada
            Resposta:
            {
                "from": data_from,
                "to": data_to,
                "rate": data_rate,
                "in_amount": data_amount,
                "out_amount": (rate_to/rate_from)*data_amount,
                "last_update": data_lastup
            }
        localhost:8080/price
            Exibe cotação de todas as moedas disponiveis para a moeda de lastro (USD)
            Resposta:
            {
                [{
                "from": USD,
                "to": data_to[0],
                "rate": data_rate,
                "last_update": data_lastup
                },
                {
                "from": USD,
                "to": data_to[1],
                "rate": data_rate,
                "last_update": data_lastup
                },
                ...
                ]
            }
    
        localhost:8080/inccurrency?code=AAA
            Se existir moeda com codigo AAA, incluir no arquivo de configuração de sendo utilizadas
            {
                "action":"AAA foi incluido na lista de moedas a serem cotadas"
            }
            Caso contrário, enviar mensagem de erro
            {
                "current":"AAA não está disponível para inclusão no momento" 
            }
        localhost:8080/rmcurrency?code=AAA
            Se existir moeda com codigo AAA, remover no arquivo de configuração de moedas sendo utilizadas
            {
                "action":"AAA foi removido na lista de moedas a serem cotadas"
            }
            Caso contrário, enviar mensagem de erro
            {
                "current":"AAA não está disponível para remoção no momento" 
            }
"""
def parse_price_all(): #Método para modelar dados de resposta do enpoind /price 
    response = []
    global lock
    lock.acquire()
    global active_data
    for item in active_data:
        data = {
            "from": "USD",
            "to": item["currency"],
            "rate": item["rate"],
            "last_update": item["last_update"]
        }
        response.append(data)
    lock.release()
    return response

def parse_price(c_from,c_to,c_amount): #Método para modelar dados de resposta do enpoind /price com parametros from, to e amount
    response = []
    global lock
    lock.acquire()
    global active_data
    confirm_from = False
    confirm_to = False
    for item in active_data:
        if c_from.upper() in item["currency"]:
            data_from = c_from.upper()
            data_rate_from = item["rate"]
            data_lastup = item["last_update"]
            confirm_from = True
        if c_to.upper() in item["currency"]:
            data_to = c_to.upper()
            data_rate_to = item["rate"]
            confirm_to = True
        if(confirm_from and confirm_to):
            break
    
    lock.release()
    if(not confirm_from and confirm_to):
        return []
    else:
        data_rate = data_rate_to/data_rate_from
        data_amount = float(c_amount)
        data = {
            "from": data_from,
            "to": data_to,
            "rate": data_rate,
            "in_amount": data_amount,
            "out_amount": (data_rate*data_amount),
            "last_update": data_lastup
        }
        response.append(data)
    return response

def parse_inccurrency(currency): #Método que trata a requisição de endpoint /inccurrency
    response = "Added"
    include = True
    global lock
    lock.acquire()
    global active_data
    global file_id
    global active_currencies
    for item in active_data:
        if currency.upper() in item["currency"]:
            response = "Already Existing"
            include = False
            break
    
    if include :
        query = "https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms="+currency.upper()
        request = requests.get(query)
        request_json = json.loads(request.text)
        #print(request_json)
        if "Response" in request_json:
            if request_json["Response"] == "Error":
                response = "Incorrect Code"
        else:
            upper_curr = currency.upper()
            if upper_curr  in request_json:
                active_currencies.append(upper_curr)
                for (currency, rate) in request_json.items():
                    aux_active_data = {
                        "currency":upper_curr,
                        "rate":rate,
                        "last_update":time.time()
                    }
                active_data.append(aux_active_data)
                active_file_name = file_id + "_active.db"
                with open(active_file_name, 'w') as input_file:
                    for input_string in active_currencies:
                        input_file.write(input_string + '\n')

    lock.release()

    return response

def parse_rmcurrency(currency): #Método que trata a requisição de endpoint /rmcurrency
    response = "Not Removed"
    remove = False
    global lock
    lock.acquire()
    global active_data
    global file_id
    global active_currencies
    for item in active_data:
        if currency.upper() in item["currency"]:
            remove = True
            break
    
    if remove :
        upper_curr = currency.upper()
        active_currencies.remove(upper_curr)
        index = 0
        pop_index = 0
        for item in active_data:
            if upper_curr in item["currency"]:
                pop_index = index
            index = index + 1
        active_data.pop(pop_index)
        active_file_name = file_id + "_active.db"
        with open(active_file_name, 'w') as input_file:
            for input_string in active_currencies:
                input_file.write(input_string + '\n')
        response = "Removed"
    lock.release()

    return response

class __responseHandler(http.server.BaseHTTPRequestHandler): #Definição da classe que gerencia as requisições HTTP
    def do_GET(self): #Definição do método que trata as requisições GET
        url = urlparse(self.path)
        path = url.path
        aux_query = urlsplit(self.path).query
        if aux_query != "":
            query = dict(parse_qsl(aux_query))
        else:
            query = dict()
        
        return_data = []
        return_code = 0
        return_message = ""
        
        #Modelo de Resposta
        server_response_dict = {
            "code": str(return_code),
            "message": return_message,
            "data": return_data
        }
        #Verificação dos endpoints
        if path.lower() == "/price":
            #localhost:8080/price?from=BRL&to=USD&amount=130.00
            #localhost:8080/price
            if query == {}:#Não existem argumentos na requisição
                server_response_dict["data"] = parse_price_all()
            else:#Existem argumentos na requisição
                if ("from" in str(query.keys()).lower()) and ("to" in str(query.keys()).lower())and ("amount" in str(query.keys()).lower()): 
                    server_response_dict["data"] = parse_price(query["from"],query["to"],query["amount"])
                else:
                    server_response_dict["data"] = []           

        if path.lower() == "/inccurrency":
            #localhost:8080/inccurrency?code=AAA
            if (query != {})and("code" in str(query.keys()).lower()): #Tratando Inputs
                server_response_dict["data"] = parse_inccurrency(query["code"])
            else:
                server_response_dict["data"] = []   
        if path.lower() == "/rmcurrency":
            #localhost:8080/rmcurrency?code=AAA
            if (query != {})and("code" in str(query.keys()).lower()): #Tratando Inputs
                #procurar no arquivo de ativos e se encontrar, remover
                server_response_dict["data"] = parse_rmcurrency(query["code"])
            else:
                server_response_dict["data"] = []   
        if len(server_response_dict["data"]) != 0:
                server_response_dict["code"] = 0
                server_response_dict["message"] = "Returning Requested Data"
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
        else:
            server_response_dict["code"] = -1
            server_response_dict["message"] = "No Data Available"
            self.send_response(202)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()

        server_response_json = json.dumps(server_response_dict)
        server_response_json = server_response_json.encode(encoding='utf_8')
        #Responde a Requisição
        self.wfile.write(server_response_json)
        
        return

def _file_management_init(file_id): #Método que gerencia a inicialização de dados da API
    active_file_name = file_id + "_active.db"
    global lock
    lock.acquire()
    global active_currencies
    if(os.path.exists(active_file_name)):
        with open(active_file_name, 'r') as input_file:
            active_currencies = [line.rstrip('\n') for line in input_file]      
    else:
        with open(active_file_name, 'w') as input_file:
            #default currencies
            default = ["USD","BRL","EUR","BTC","ETH"]
            for input_string in default:
                input_file.write(input_string + '\n')
            active_currencies = default
    lock.release()

def _cryptocompare_query(): #Método que faz uma requisição para o Cryptocompare e verifica a cotação
    global lock
    lock.acquire()
    global active_data
    global active_currencies
    aux_query = ""
    query = "https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms="
    for currency in active_currencies:
        aux_query = aux_query+currency+","
    query = query + aux_query
    request = requests.get(query)
    request_json = json.loads(request.text)
    #print(request_json)
    for (currency, rate) in request_json.items():
        aux_active_data = {
            "currency":currency,
            "rate":rate,
            "last_update":time.time()
        }
        active_data.append(aux_active_data)
    #print(active_data)
    lock.release()

def _thread_Currency_Update(file_id,period): #Método da Thread principal na qual se analisa quando será atualizada as cotações
    start_t = time.time()
    current_t_s = start_t
    next_t = 0
    _file_management_init(file_id) #verifica se arquivos iniciais existem, se sim adiciona eles na RAM
    while 1:
        current_t_s = int(time.time() - start_t)
        if(current_t_s >= next_t):
            _cryptocompare_query()
            next_t = current_t_s + period
            pass
        time.sleep(10)

#Definições dos parâmetros de rede + API

host = 'localhost'
port = 8080
file_id = "currency"
period = 10*60 #10min
active_currencies = []
active_data = []
lock = _thread.allocate_lock()

try:
   _thread.start_new_thread( _thread_Currency_Update,(file_id,period)) #Gera a Thread principal da API
except:
   print("Error: unable to start thread")
   exit()

try :
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer((host,port), __responseHandler)
    httpd.serve_forever() #Inicializa o servidor de requisições
        
except KeyboardInterrupt:
    exit()