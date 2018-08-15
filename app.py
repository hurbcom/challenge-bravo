#!/usr/bin/python
# -*- coding: utf-8 -*-
from flask import Flask
from flask import request
import requests,os,json,time
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
Database = 'coins.db'


@app.route('/api', methods=['GET'])
def index():
    #pego parametros
    from_ = request.args.get('from')
    to = request.args.get('to')
    amount = request.args.get('amount')
    # converto tudo para caixa baixa
    from_ = from_.decode('utf-8').lower()
    to = to.decode('utf-8').lower()

    # verifica se colocou a mesma moeda como entrada e saida.
    if from_ == 'usd' and to == 'usd':
        verify = True
    elif from_ == 'btc' and to == 'btc':
        verify = True
    elif from_ == 'eth' and to == 'eth':
        verify = True
    else:
        verify = False
    return treatmentofValues(from_, to, amount, verify)


def treatmentofValues(from_,to,amount,verify,):
    try:
        if os.stat(Database).st_size==0:
            getvaluesJob()
    except Exception as e:
        getvaluesJob()

    with open(Database) as file: #lê as moedas no Database
        data = file.read()
        data = json.loads(data)

    if verify == True: # verificando se colocou usd/btc/eth como entrada e saida. caso verdadeiro seta como 1 pois um dolar vale um dolar e na api não tem isso
        rate_to = 1
        rate_from = 1
    #aqui começo uma série de verificaçoes para não dar erros. Essa macumba poderia ser feita de outras formas mas foi a que consegui pensar no momento.
    if from_ == 'btc' and to == 'usd' and verify == False:
        rate_from = 1
        rate_to = data[0]['BTC']['USD']
    elif from_ == 'eth' and to == 'usd' and verify == False:
        rate_from = 1
        rate_to = data[0]['ETH']['USD']
    elif from_ == 'btc' and to == 'eth' and verify == False:
        rate_from = 1
        rate_to = data[0]['ETH']['BTC']
    elif from_ == 'eth' and to == 'btc' and verify == False:
        rate_from = 1
        rate_to = data[0]['BTC']['ETH']
    else:
        if to == 'btc' and from_ == 'usd' and verify == False:
            rate_from = 1
            rate_to = 1 / data[0]['BTC']['USD']
        elif to == 'eth' and from_ == 'usd' and verify == False:
            rate_from = 1
            rate_to = 1 / data[0]['ETH']['USD']
        else:
            if from_ == 'btc' and verify == False:
                rate_from = 1
                rate_to = data[0]['BTC']['USD'] * data[1][to]['rate']
            elif from_ == 'eth' and verify == False:
                rate_from = 1
                rate_to = data[1][to]['rate'] * data[0]['ETH']['USD']
            elif to == 'eth' and verify == False:
                rate_from = 1
                rate_to = data[1][from_]['inverseRate'] / data[0]['ETH']['USD']
            elif to == 'btc' and verify == False:
                rate_from = 0.1
                rate_to = data[1][from_]['inverseRate'] / data[0]['BTC']['USD']
            else:
                # aqui verifico se dolar for a saida(to) eu pego o valor de inverseRate
                if to == 'usd' and verify == False:
                    rate_from = 1
                    rate_to = data[1][from_]['inverseRate']
                #aqui verifico se dolar for a entrada, seto dolar valendo 1 e pego o valor da outra moeda(to) e faço a conta
                if from_ == 'usd' and verify == False:
                    rate_from = 1
                    rate_to = data[1][to]['rate']
                #aqui verifico se from e to forem diferente de dolar faz a conta
                if from_ != 'usd' and to != 'usd' and verify == False:
                    rate_to = data[1][to]['rate']
                    rate_from = data[1][from_]['rate']
    return calculateConversion(amount,rate_to,rate_from,from_.decode('utf-8').upper(),to.decode('utf-8').upper())

def calculateConversion(amount,rate_to,rate_from,rate_from_name,rate_to_name):
    converted = float(amount) * (rate_to / rate_from)
    converted = """{
    "data": {
        "from": """+ str(rate_from_name) +""",
        "to": """+ str(rate_to_name) +""",
        "amount": """+ str(amount) +""",
        "converted_amount": """+ str(converted) +"""
    }
} """
    return str(converted)

# função job que atualiza a Database
def getvaluesJob():
    try:
        request = requests.get('http://www.floatrates.com/daily/usd.json')
        request_BTC = requests.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD,BTC,ETH')
        file = open(Database, 'w')
        file.write("["+request_BTC.text+","+request.text+"]")
        file.close
    except Exception as e:
        raise
    return str('Updating Database')

sched = BackgroundScheduler(daemon=True)
sched.add_job(getvaluesJob,'interval',minutes=3)
sched.start()

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', threaded=True)
