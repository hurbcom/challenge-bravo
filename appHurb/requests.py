#Importação de módulos e bibliotecas
import requests
from flask import jsonify
from .models import Currencies
from .models import db
from datetime import datetime

#Essa função retorna o valor atual do dólar comercial(USD), para que mais a frente possamos normalizar o lastro das moedas retornadas ao dólar
def getUSD():
    URL = f"https://economia.awesomeapi.com.br/USD-CAD"
    data = requests.get(url = URL)
    data = data.json()
    usd_value = float(data[0]['bid'])
    return usd_value


#This functions gets current currency quote from an external API
def getDataFromAPI(currency):
    currency = currency.upper()
    if currency == "BRL":
        usd_value = getUSD()
        brl_value = 1*usd_value

        return {"name": "Real brasileiro",
                "value": "%.4f" % brl_value,
                "lastro": "USD"}
    else:
        usd_value = getUSD()
        URL = f"https://economia.awesomeapi.com.br/{currency}-CAD"
        data = requests.get(url = URL)
        data = data.json()
        if data == []:
            return False
        else:
            name = data[0]["name"]
            actual_currency_value = float(data[0]['bid'])
            #Cálculo para normalizar o valor das moedas à moeda de lastro(USD)
            x = actual_currency_value/usd_value
            conversion = 1 / x
            return {"name": name,
                    "value":"%.4f" % conversion,
                    "lastro": "USD"}

#Essa função vai ao banco de dados, faz uma requisição a api externa e atualiza os dados no banco de dados, isso é feito sempre que o servidor é iniciado.
def updateDB():
    currency = Currencies.query.all()
    for i in range(len(currency)):
        currency_code = currency[i].code
        currency_value = getDataFromAPI(currency_code)
        currency[i].value = currency_value["value"]
        currency[i].update_time = datetime.now()
        db.session.commit()
    pass


#Pega os dados de determinada moeda no banco de dados para ser enviada como resposta nas rotas da API
def getDataFromDB(currency):
    currency = currency.upper()
    data = Currencies.query.filter_by(code=currency).first()
    if data == None:
        return {"STATUS": "Moeda ausente em nosso banco de dados",
                "DICA": "Verifique nossa documentação e adicione as moedas disponíveis"}
    else:
        code = data.code
        name = data.currency
        value = data.value
        lastro = data.lastro
        update_time = data.update_time
        return {"name": name,
                "value": value,
                "update_time": update_time}

#Deleta determinada moeda existente do banco de dados
def removeFromDB(currency):
    currency = currency.upper()
    data = Currencies.query.filter_by(code=currency).first()
    if data == None:
        return False
    else:
        db.session.delete(data)
        db.session.commit()
        return True

#Adiciona determinada moeda ao banco de dados
def addCurrency(currency):
    currency = currency.upper()
    actual_currency = getDataFromAPI(currency)
    if actual_currency == False:
        return False
    else:
        name = actual_currency["name"]
        value = actual_currency["value"]
        lastro = actual_currency["lastro"]
        code = currency
        currency = Currencies(code=currency,currency=name,value=value,lastro=lastro)
        db.session.add(currency)
        db.session.commit()
        return True