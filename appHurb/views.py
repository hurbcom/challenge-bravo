#Importação de módulos e bibliotecas
from flask import Flask, jsonify, request
import requests
from . import appHurb
from .requests import getDataFromAPI, getDataFromDB, addCurrency, removeFromDB
from flask_sqlalchemy import SQLAlchemy
from .models import Currencies

#Esta rota retorna informações sobre determinada moeda: Lastro, nome e valor baseado na moeda de lastro
@appHurb.route('/status/<currency>')
def currencyDetails(currency):
  currency_data = getDataFromDB(currency)
  return currency_data

#Esta rota retorna a conversão entre duas moedas e uma quantia, parâmetros: moeda de origem/moeda a ser convertida/ valor a ser convertido da moeda origem para moeda destino
@appHurb.route('/<origen_currency>/<destiny_currency>/<amount>')
def currencyConverter(origen_currency,destiny_currency,amount):

  #Pegando dados no banco de dados para a moeda de origem
  origen_currency_data = getDataFromDB(origen_currency)
  #Pegando dados no banco de dados para a segunda origem
  destiny_currency_data = getDataFromDB(destiny_currency)
  name = destiny_currency_data["name"]
  update_time = destiny_currency_data["update_time"]

  #Conta para a conversão do valore entre as moedas
  x = float(destiny_currency_data["value"]) / float(origen_currency_data["value"])
  final_amount = x * float(amount)


  return {"name": name,
          "value": final_amount,
          "update_time": update_time}



#Esta rota aceita 2 métodos HTTP
#POST: Adiciona ao banco de dados a moeda passada como parâmetro
#DELETE: Deleta do banco de dados a moeda passada como parâmetro
@appHurb.route('/<currency>', methods=['POST','DELETE'])
def add(currency):
    currency = currency.upper()
    if request.method == 'POST':
        if addCurrency(currency) == True:
            return {'CODIGO': currency,
                    'STATUS': "ADICIONADA"}
        else:
            return {'STATUS': 'Moeda não adicionada, verifique na documentação se esta moeda pode ser adicionada.'}
    else:
        if removeFromDB(currency) == True:
            return {'CODIGO': currency,
                    'STATUS': 'DELETADA'}
        else:
            return {'STATUS': 'Moeda não deletada, verifique se o banco de dados possui esta moeda.'}