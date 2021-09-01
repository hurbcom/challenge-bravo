# Importing the libraries
import json
from flask import Flask, jsonify, request
import requests
from uuid import uuid4
import APICaller
import CurrencyDAO
import DB



class ExchangePrice:

    # Init function on startup
    def __init__(self):
        self.currencies = ['USD', 'BRL', 'EUR', 'BTC', 'ETH']


# Creating a Web App
app = Flask(__name__)

# Creating an address for the node on Port 5000
node_address = str(uuid4()).replace('-', '')

# Creating a Blockchain
exchangePrice = ExchangePrice()



# Definindo o caminho da API
@app.route('/getPrice', methods = ['GET'])
def getExchangePrice():
    currencyFrom = request.args.get('from')
    currencyTo = request.args.get('to')
    currencyAmount = request.args.get('amount')
    CurrencyDAO.CurrencyDAO().test()
    # Validando a existência dos argumentos
    if not currencyFrom or not currencyTo or not currencyAmount:
        return "Any element of the request is missing", 400
    response =  APICaller.APICaller().update_currency_value('BTC');
    return jsonify(response), 200
    

# Running the app
app.run(host = '0.0.0.0', port = 5000)
