#!/usr/bin/python
# -*- coding: utf-8 -*-
from flask import Flask
from flask import request
import requests,os,json,time
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
Database = 'coins.txt'


@app.route('/api', methods=['GET'])
def index():
    from_ = request.args.get('from')
    to = request.args.get('to')
    amount = request.args.get('amount')
    # verifica se colocou dolar como entrada e saida
    if from_.decode('utf-8').lower() == 'usd' and to.decode('utf-8').lower() == 'usd':
        verify = True
    elif from_.decode('utf-8').lower() == 'btc' and to.decode('utf-8').lower() == 'btc':
        verify = True
    elif from_.decode('utf-8').lower() == 'eth' and to.decode('utf-8').lower() == 'eth':
        verify = True
    else:
        verify = False
    if validate(from_, to) == False:
        validate_ =  'error'
    else:
        validate_ = treatmentofValues(from_, to, amount, verify)
    return validate_

def validate(from_, to):
    if from_.decode('utf-8').lower() == 'usd' or 'eur' or 'brl' or 'eth' or 'btc' and to.decode('utf-8').lower() == 'usd' or 'eur' or 'brl' or 'eth' or 'btc':
        validate_ = True
    else:
        validate_ = False
    return validate_

def treatmentofValues(from_,to,amount,verify,):
    try:
        if os.stat(Database).st_size==0:
            getvaluesJob()
    except Exception as e:
        getvaluesJob()

    with open(Database) as file: #lê as moedas
        data = file.read()
        data = json.loads(data)

    if verify == True: # verificando que colocou o dolar como entrada e saida seta dolar como 1
        rate_to = 1
        rate_from = 1

    if from_.decode('utf-8').lower() == 'btc' and to.decode('utf-8').lower() == 'usd' and verify == False:
        rate_from = 1
        rate_to = data[0]['BTC']['USD']
    elif from_.decode('utf-8').lower() == 'eth' and to.decode('utf-8').lower() == 'usd' and verify == False:
        rate_from = 1
        rate_to = data[0]['ETH']['USD']
    elif from_.decode('utf-8').lower() == 'btc' and to.decode('utf-8').lower() == 'eth' and verify == False:
        rate_from = 1
        rate_to = data[0]['ETH']['BTC']
    elif from_.decode('utf-8').lower() == 'eth' and to.decode('utf-8').lower() == 'btc' and verify == False:
        rate_from = 1
        rate_to = data[0]['BTC']['ETH']
    else:
        if to.decode('utf-8').lower() == 'btc' and from_.decode('utf-8').lower() == 'usd' and verify == False:
            rate_from = 1
            rate_to = 1 / data[0]['BTC']['USD']
        elif to.decode('utf-8').lower() == 'eth' and from_.decode('utf-8').lower() == 'usd' and verify == False:
            rate_from = 1
            rate_to = 1 / data[0]['ETH']['USD']
        else:
            if from_.decode('utf-8').lower() == 'btc' and verify == False:
                rate_from = 1
                rate_to = data[0]['BTC']['USD'] * data[1][to]['rate']
            elif from_.decode('utf-8').lower() == 'eth' and verify == False:
                rate_from = 1
                rate_to = data[1][to.decode('utf-8').lower()]['rate'] * data[0]['ETH']['USD']
            elif to.decode('utf-8').lower() == 'eth' and verify == False:
                rate_from = 1
                rate_to = data[1][from_.decode('utf-8').lower()]['inverseRate'] / data[0]['ETH']['USD']
            elif to.decode('utf-8').lower() == 'btc' and verify == False:
                rate_from = 0.1
                rate_to = data[1][from_.decode('utf-8').lower()]['inverseRate'] / data[0]['BTC']['USD']
            else:
                # aqui verifico se dolar for a saida(to) eu pego o valor de inverseRate
                if to.decode('utf-8').lower() == 'usd' and verify == False:
                    rate_from = 1
                    rate_to = data[1][from_.decode('utf-8').lower()]['inverseRate']
                #aqui verifico se dolar for a entrada, seto dolar valendo 1 e pego o valor da outra moeda(to) e faço a conta
                if from_.decode('utf-8').lower() == 'usd' and verify == False:
                    rate_from = 1
                    rate_to = data[1][to.decode('utf-8').lower()]['rate']
                #aqui verifico se from e to forem diferente de dolar faz a conta
                if from_.decode('utf-8').lower() != 'usd' and to.decode('utf-8').lower() != 'usd' and verify == False:
                    rate_to = data[1][to.decode('utf-8').lower()]['rate']
                    rate_from = data[1][from_.decode('utf-8').lower()]['rate']
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


def getvaluesJob():
    request = requests.get('http://www.floatrates.com/daily/usd.json')
    request_BTC = requests.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD,BTC,ETH')
    file = open(Database, 'w')
    file.write("["+request_BTC.text+","+request.text+"]")
    file.close
    return str('Updating Database')

sched = BackgroundScheduler(daemon=True)
sched.add_job(getvaluesJob,'interval',minutes=3)
sched.start()

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', threaded=True)
