import requests
import json

#Obtem as taxas de cambio atuais em dólar

url = "https://min-api.cryptocompare.com/data/price"
querystring = {"fsym":"USD","tsyms":"USD,BRL,EUR,BTC,ETH"}
response = requests.request("GET", url, params=querystring)

usd_rates = json.loads(response.text)

