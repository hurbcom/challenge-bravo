from flask import Flask
from flask_restful import Api, Resource, reqparse
import requests, json

#inicializando a biblioteca Flask para as requisições do json.
app = Flask(__name__)
api = Api(app)

#data é o dicionário que armazena as informações das moedas que serão guardadas no arquivo json.
data = {}

#essas duas listas são usadas para verificar as moedas que atualmente existem no conversor, ela é modificada caso se adiciona uma nova moeda.
valid_currencies_symbols = ["usd", "eur", "brl", "btc", "eth"]
valid_currencies_names = ["dollar", "euro", "real", "bitcoin", "ethereum"]

#número total de moedas aceitas pelo conversor.
curr_amount = 5

#função que verifica se duas moedas são válidas para esse conversor.
def verify_valid_currencies(to_cur, from_cur):
    to_conf = False
    from_conf = False

    #verificação se foram passados símolos válidos.
    for item in valid_currencies_symbols:
        if(to_cur == item):
            to_conf = True
        if(from_cur == item):
            from_conf = True

    #verificação se foram passados nomes válidos.
    for item in valid_currencies_names:
        if(to_cur == item):
            to_conf = True
        if(from_cur == item):
            from_conf = True
    
    if(to_conf and from_conf):
        return True
    else:
        return False
    

#função que atualiza o json, é chamada na inicialização do programa pra atualizar os valores das moedas.
def atualiza_json():
    
    import requests, json
    global data

    #pegando o json da floatrates, para os valores das moedas não cripto.
    r = requests.get('http://www.floatrates.com/daily/usd.json')

    result = r.json()
    cont = 0
    
    for item in valid_currencies_symbols:
        #como o site lastreia o valor baseado no dolar, ele não inclui a moeda dolar, então o valor é setado inicialmente como 1.
        if(item == "usd"):
            rate = 1
            code = 'usd'
            name = 'Dollar'
        else :
            #verifica se a moeda que está sendo adicionada foi encontrada no json da floatrates.
            if(item in result):
                rate = result[item]["inverseRate"]
                name = result[item]["name"]
                code = item
            else:
                #fazendo a requisição para a api do coinmarketcap para pegar o valor das criptomoedas.
                rc = requests.get('https://api.coinmarketcap.com/v1/ticker/'+valid_currencies_names[cont])
                
                #verificando se a requisição foi bem sucedida.
                if(rc == "<response 200>"):
                    resultc = rc.json()
                    rate = resultc[0]['price_usd']
                    name = valid_currencies_names[cont]
                    code = resultc[0]['symbol'].lower()
                
                #caso não seja possível encontrar a moeda em nenhuma das APIs, retorna -1 como erro.
                else:
                    print("moeda nao encontrada")
                    return -1
        
        #inclui os valores do dic data que será utilizado para criar o arquivo json
        data[code] = []
        data[code].append({
        'name': name,
        'code': code,
        'rate': rate
        })
        cont+=1

    #abre o arquivo json e preenche com os valores do dicionario "data".    
    with open('currencies.json', 'w') as outfile:
        json.dump(data, outfile)
    
    
    
#função que calcula a conversão entre duas moedas.
def realiza_conversao(from_cur, to_cur, amount):


    #abrindo o arquivo json no modo leitura, lendo os dados necessarios para realizar a conversão e retornando o total.
    with open('currencies.json', 'r') as json_file:
        data = json.load(json_file)
        f = data[from_cur]
        t = data[to_cur]
        f_rate = float(f[0]['rate'])
        t_rate = float(t[0]['rate'])
        print(f_rate, t_rate, amount)
        total = (amount*f_rate)/t_rate
        print(total)
    
    return total

#função que adiciona uma nova moeda na lista de moedas válidas do conversor.
def add_currency(symbol, name):
    global curr_amount
    global valid_currencies_names
    global valid_currencies_symbols
    global data

    #pegando as informações da moeda no caso em que não é uma criptomoeda.
    r = requests.get('http://www.floatrates.com/daily/usd.json')
    result = r.json()

    if(symbol in result):
                rate = result[symbol]["inverseRate"]
                name = result[symbol]["name"]
                code = symbol.lower()
    else:
        #pegando as informações da moeda para o caso em que é uma criptomoeda.
        rc = requests.get('https://api.coinmarketcap.com/v1/ticker/'+name)
        print(rc)
                
                
        if(rc == "<response 200>"):
            resultc = rc.json()
            rate = resultc[0]['price_usd']
            name = name
            code = symbol.lower()
                
        else:
            print("moeda nao encontrada")
            return False
    
    #adicionando as informações da nova moeda ao dicionário de dados.
    data[symbol] = []
    data[symbol].append({
    'name': name,
    'code': symbol,
    'rate': rate
    })

    #adicionando a nova moeda a lista de moedas válidas.
    valid_currencies_names.append(name)
    valid_currencies_symbols.append(symbol)

    #atualizando o arquivo json com a nova moeda.
    with open('currencies.json', 'w') as outfile:
        json.dump(data, outfile)

    #atualizando o número total de moedas válidas.
    curr_amount+=1
    return True
    
    